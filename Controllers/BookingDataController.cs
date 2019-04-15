using System;
using System.Collections.Generic;
using System.Linq;
using DAL;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;

namespace gym.Controllers
{
    [Route("api/[controller]")]
    public class BookingDataController : Controller
    {
        // Return all possible sessions that the user is not already booked onto
        [HttpGet("[action]")]
        public JsonResult GetAllSessions(int userId)
        {
            using (var context = new GymContext())
            {
                var userAttending = context.Attending
                    .Where(x => x.UserId == userId)
                    .Select(x => x.BookingId)
                    .ToList();
                
                var userWaiting = context.Waiting
                    .Where(x => x.UserId == userId)
                    .Select(x => x.BookingId)
                    .ToList();

                var bookings = context.Booking
                    .Include(x => x.Class)
                    .Where(x => !userAttending.Contains(x.BookingId) && !userWaiting.Contains(x.BookingId) && x.DateTime > DateTime.Now)
                    .Select(x => new
                    {
                        classId = x.ClassId,
                        className = x.Class.ClassName,
                        bookingId = x.BookingId,
                        dateTime = x.DateTime,
                        maxCapacity = x.Room.MaxCapacity,
                        numAttending = x.Attending.Count
                    })
                    .OrderBy(x => x.className)
                    .ToList();

                return Json(bookings);
            }
        }
        
        // Return all possible sessions for the class selected
        [HttpGet("[action]")]
        public JsonResult GetSessions(int classId, int userId)
        {
            using (var context = new GymContext())
            {
                var userAttending = context.Attending
                    .Where(x => x.UserId == userId)
                    .Select(x => x.BookingId);
                var userWaiting = context.Waiting
                    .Where(x => x.UserId == userId)
                    .Select(x => x.BookingId);
                
                var sessions = context.Booking
                    .Where(x => x.ClassId == classId 
                                && x.DateTime > DateTime.Now
                                && !userAttending.Contains(x.BookingId)
                                && !userWaiting.Contains(x.BookingId))
                    .Select(x => x.DateTime)
                    .OrderBy(x => x.Date)
                    .ToList();
                return Json(sessions);
            } 
        }
        
        // Return all possible sessions 
        [HttpGet("[action]")]
        public JsonResult GetAllPossibleSessions()
        {
            using (var context = new GymContext())
            {
                var sessions = context.Booking
                    .Where(x => x.DateTime > DateTime.Now)
                    .Select(x => new
                    {
                        id = x.BookingId,
                        className = x.Class.ClassName,
                        dateTime = x.DateTime,
                        roomName = x.Room.RoomName,
                        numAttending = x.Attending,
                        numWaiting = x.Waiting,
                        maxCapacity = x.Room.MaxCapacity,
                        trainerName = x.Trainer.TrainerFirstName
                    })
                    .OrderBy(x => x.dateTime)
                    .ToList();
                return Json(sessions);
            } 
        }
        
        // Get user's bookings
        [HttpGet("[action]/{id}")]
        public JsonResult GetUserBookings(int id)
        {
            using (var context = new GymContext())
            {
                var userAttending = context.Attending
                    .Include(x => x.Booking)
                    .ThenInclude(x => x.Class)
                    .Include(x => x.Booking)
                    .ThenInclude(x => x.Room)
                    .Include(x => x.Booking)
                    .ThenInclude(x => x.Trainer)
                    .Where(x => x.UserId == id && x.Booking.DateTime > DateTime.Now)
                    .Select(x => new
                    {
                        id = x.BookingId,
                        className = x.Booking.Class.ClassName,
                        dateTime = x.Booking.DateTime,
                        trainerName = x.Booking.Trainer.TrainerFirstName,
                        roomName = x.Booking.Room.RoomName,
                        attending = x.Booking.Attending,
                        waiting = x.Booking.Waiting,
                        maxCapacity = x.Booking.Room.MaxCapacity
                    })
                    .OrderBy(x => x.dateTime)
                    .ToList();
                return Json(userAttending);
            }
        }
        
        // Get bookings where user is on the waiting list
        [HttpGet("[action]/{id}")]
        public JsonResult GetUserWaiting(int id)
        {
            using (var context = new GymContext())
            {
                var userAttending = context.Waiting
                    .Include(x => x.Booking)
                    .ThenInclude(x => x.Class)
                    .Include(x => x.Booking)
                    .ThenInclude(x => x.Room)
                    .Include(x => x.Booking)
                    .ThenInclude(x => x.Trainer)
                    .Where(x => x.UserId == id && x.Booking.DateTime > DateTime.Now)
                    .Select(x => new
                    {
                        id = x.BookingId,
                        className = x.Booking.Class.ClassName,
                        dateTime = x.Booking.DateTime,
                        trainerName = x.Booking.Trainer.TrainerFirstName,
                        roomName = x.Booking.Room.RoomName,
                        attending = x.Booking.Attending,
                        waiting = x.Booking.Waiting,
                        maxCapacity = x.Booking.Room.MaxCapacity
                    })
                    .OrderBy(x => x.dateTime)
                    .ToList();
                return Json(userAttending);
            }
        }
        
        // Get list of trainers who can take a session
        [HttpGet("[action]/{dateTime}")]
        public JsonResult GetTrainers(DateTime dateTime)
        {
            using (var context = new GymContext())
            {   
                var occupiedTrainers = context.Booking
                    .Where(x => x.DateTime == dateTime)
                    .Select(x => x.TrainerId)
                    .ToList();

                var trainers = context.GymTrainer
                    .Where(x => !occupiedTrainers.Contains(x.TrainerId))
                    .Select(x => new
                    {
                        id = x.TrainerId,
                        name = x.TrainerFirstName
                    })
                    .ToList();

                return Json(trainers);
            }
        }

        // Delete a booking
        [HttpDelete("[action]")]
        public void DeleteBooking(int bookingId, int userId)
        {
            using (var context = new GymContext())
            {
                var bookingToDelete = context.Attending
                    .FirstOrDefault(x => x.BookingId == bookingId & x.UserId == userId);
                if (bookingToDelete != null)
                {
                    context.Attending.Remove(bookingToDelete);
                }

                var userWaiting = context.Waiting
                    .FirstOrDefault(x => x.BookingId == bookingId);
                if (userWaiting != null)
                {
                    context.Attending.Add(new Attending
                    {
                        BookingId = bookingId,
                        UserId = userWaiting.UserId
                    });
                    context.Waiting.Remove(userWaiting);
                }
                
                context.SaveChanges();
            }
        }
        
        // Delete a booking (from the waiting list)
        [HttpDelete("[action]")]
        public void DeleteWaiting(int bookingId, int userId)
        {
            using (var context = new GymContext())
            {
                var bookingToDelete = context.Waiting
                    .FirstOrDefault(x => x.BookingId == bookingId & x.UserId == userId);
                if (bookingToDelete != null)
                {
                    context.Waiting.Remove(bookingToDelete); 
                }    
                context.SaveChanges();
            }
        }
        
        // Delete a session 
        [HttpDelete("[action]/{bookingId}")]
        public void DeleteSession(int bookingId)
        {
            using (var context = new GymContext())
            {
                var sessionToDelete = context.Booking
                    .FirstOrDefault(x => x.BookingId == bookingId);

                var attendingToDelete = context.Attending
                    .Where(x => x.BookingId == bookingId)
                    .ToList();
                
                var waitingToDelete = context.Waiting
                    .Where(x => x.BookingId == bookingId)
                    .ToList();
                
                context.Attending.RemoveRange(attendingToDelete);
                context.Waiting.RemoveRange(waitingToDelete);
                if (sessionToDelete != null)
                {
                    context.Booking.Remove(sessionToDelete);

                }
                context.SaveChanges();
            }
        }
        
        // Get users who are attending and waiting for a session
        [HttpGet("[action]/{bookingId}")]
        public JsonResult GetUsers(int bookingId)
        {
            using (var context = new GymContext())
            {
                var users = context.Booking
                    .Where(x => x.BookingId == bookingId)
                    .Select(x => new
                    {
                        attending = x.Attending,
                        waiting = x.Waiting
                    })
                    .ToList();
                return Json(users);
            }
        }

        // Book a user onto a class
        [HttpPost("[action]")]
        public void BookClass(int bookingId, int userId)
        {
            using (var context = new GymContext())
            {
                context.Attending.Add(new Attending
                {
                    BookingId = bookingId,
                    UserId = userId        
                });
                context.SaveChanges();
            }
        }
        
        // Book a user onto the waiting list for a class
        [HttpPost("[action]")]
        public void BookClassWaitingList(int bookingId, int userId)
        {
            using (var context = new GymContext())
            {
                context.Waiting.Add(new Waiting
                {
                    BookingId = bookingId,
                    UserId = userId        
                });
                context.SaveChanges();
            }
        }
        
        // Get all room names
        [HttpGet("[action]")]
        public JsonResult GetAllRooms()
        {
            using (var context = new GymContext())
            {
                var rooms = context.Room
                    .Select(x => x.RoomName)
                    .ToList();
                return Json(rooms);
            }
        }

        [HttpGet("[action]/{trainerId}")]
        public JsonResult GetTrainerSessions(int trainerId)
        {
            using (var context = new GymContext())
            {
                var trainerSessions = context.Booking
                    .Where(x => x.TrainerId == trainerId && x.DateTime > DateTime.Now)
                    .Select(x => new
                    {
                        id = x.BookingId,
                        className = x.Class.ClassName,
                        dateTime = x.DateTime,
                        roomName = x.Room.RoomName,
                        numAttending = x.Attending,
                        numWaiting = x.Waiting,
                        maxCapacity = x.Room.MaxCapacity,
                        trainerName = x.Trainer.TrainerFirstName
                    })
                    .OrderBy(x => x.dateTime)
                    .ToList();
                return Json(trainerSessions);
            }
        }

        [HttpGet("[action]/{roomId}")]
        public JsonResult GetOccupiedTimeSlots(int roomId)
        {
            using (var context = new GymContext())
            {
                var occupiedSlots = context.Booking
                    .Where(x => x.RoomId == roomId)
                    .Select(x => new
                        {
                            dateTime = x.DateTime
                        })
                    .ToList();
                return Json(occupiedSlots);
            }
        }

        [HttpPost("[action]")]
        public void ScheduleSession(int classId, int trainerId, int roomId, DateTime dateTime)
        {
            using (var context = new GymContext())
            {
                context.Booking.Add(new Booking
                {
                    ClassId = classId,
                    TrainerId = trainerId,
                    RoomId = roomId,
                    DateTime = dateTime
                });
                context.SaveChanges();
            }
        }

        [HttpPost("[action]")]
        public JsonResult GetClassVal([FromBody] List<int> classIds)
        {
            using (var context = new GymContext())
            {
                var classValues = new List<ClassIdValue>();
                var classes = new List<int>();
                var listToReturn = new List<Class>();

                foreach (var classId in classIds)
                {
                    var attendingVal = context.Booking
                        .Include(x => x.Class)
                        .Include(x => x.Attending)
                        .Where(x => x.ClassId == classId)
                        .SelectMany(x => x.Attending)
                        .Count();
                
                    var waitingVal = context.Booking
                        .Include(x => x.Class)
                        .Include(x => x.Waiting)
                        .Where(x => x.ClassId == classId)
                        .SelectMany(x => x.Waiting)
                        .Count();

                    var classVal = attendingVal + waitingVal;
                    
                    classValues.Add(new ClassIdValue
                    {
                        Id = classId,
                        Value = classVal
                    });   
                }

                classValues = classValues
                    .OrderByDescending(x => x.Value)
                    .Take(3)
                    .ToList();

                foreach (var aValue in classValues)
                {
                    classes.Add(aValue.Id);
                }

                var classesList = context.Class
                    .Where(x => classes.Contains(x.ClassId))
                    .ToList();

                foreach (var c in classes)
                {
                    foreach (var aClass in classesList)
                    {
                        if (c == aClass.ClassId)
                        {
                            listToReturn.Add(aClass);
                        }
                    }
                }
                
                
                return Json(listToReturn);
            }
        }
    }

    public class ClassIdValue
    {
        public int Id { get; set; }
        public int Value { get; set; }
    }
    
}
