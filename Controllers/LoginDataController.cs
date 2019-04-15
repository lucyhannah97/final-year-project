using System.Linq;
using System.Xml.Linq;
using DAL;
using Microsoft.AspNetCore.Mvc;

namespace gym.Controllers
{
    [Route("api/[controller]")]
    public class LoginDataController : Controller
    {
        
        [HttpGet("[action]")]
        public JsonResult VerifyUser(string type, string email, string pword){
            using(var context = new GymContext())
            {
                switch (type)
                {                    
                    case "trainer":
                        var trainer = context.GymTrainer
                            .Where(x => x.TrainerEmail == email 
                                        && x.TrainerPassword == pword)
                            .Select(x => new
                            {
                                id = x.TrainerId,
                                type = "trainer"
                            })
                            .ToList();
                        return Json(trainer);
                    
                    case "admin":
                        var admin = context.Administrator
                            .Where(x => x.AdminEmail == email 
                                        && x.AdminPassword == pword)
                            .Select(x => new
                            {
                                id = x.AdminId,
                                type = "admin"
                            })
                            .ToList();
                        return Json(admin);
                    
                    default:
                        var user = context.GymUser
                            .Where(x => x.UserEmail == email 
                                        && x.UserPassword == pword)
                            .Select(x => new
                            {
                                id = x.UserId,
                                type = "user"
                            })
                            .ToList();
                        return Json(user);
                }
            }
        }

        [HttpPost("[action]")]
        public void CreateNewUser(string firstname, string surname, string email, string password)
        {
            using (var context = new GymContext())
            {
                context.GymUser.Add(new GymUser
                {
                    UserFirstName = firstname,
                    UserSurname = surname,
                    UserEmail = email,
                    UserPassword = password
                });
                context.SaveChanges();
            }
        }
        
        [HttpPost("[action]")]
        public void CreateNewTrainer(string firstname, string surname, string email, string password)
        {
            using (var context = new GymContext())
            {
                context.GymTrainer.Add(new GymTrainer
                {
                    TrainerFirstName = firstname,
                    TrainerSurname = surname,
                    TrainerEmail = email,
                    TrainerPassword = password
                });
                context.SaveChanges();
            }
        }
        
        [HttpPost("[action]")]
        public void CreateNewAdmin(string firstname, string surname, string email, string password)
        {
            using (var context = new GymContext())
            {
                context.Administrator.Add(new Administrator
                {
                    AdminFirstName = firstname,
                    AdminSurname = surname,
                    AdminEmail = email,
                    AdminPassword = password
                });
                context.SaveChanges();
            }
        }

        [HttpGet("[action]")]
        public bool CheckExisting(string userType, string email)
        {
            using (var context = new GymContext())
            {
                switch (userType)
                {
                    case "admin":
                        var admin = context.Administrator
                            .Any(x => x.AdminEmail == email);
                        return admin;
                    
                    case "trainer":
                        var trainer = context.GymTrainer
                            .Any(x => x.TrainerEmail == email);
                        return trainer;
                    
                    default:
                        var user = context.GymUser
                            .Any(x => x.UserEmail == email);
                        return user;
                }
            }
        }

        [HttpGet("[action]")]
        public JsonResult GetExistingUsers()
        {
            using (var context = new GymContext())
            {
                var users = context.GymUser
                    .Select(x => new
                    {
                        id = x.UserId,
                        firstName = x.UserFirstName,
                        surname = x.UserSurname,
                        email = x.UserEmail
                    })
                    .ToList();
                return Json(users);
            }
        }

        [HttpGet("[action]")]
        public JsonResult GetAllTrainers()
        {
            using (var context = new GymContext())
            {
                var trainers = context.GymTrainer
                    .Select(x => x.TrainerFirstName)
                    .Distinct()
                    .ToList();
                return Json(trainers);
            }
        }
        
        [HttpGet("[action]")]
        public JsonResult GetExistingTrainers()
        {
            using (var context = new GymContext())
            {
                var users = context.GymTrainer
                    .Select(x => new
                    {
                        id = x.TrainerId,
                        firstName = x.TrainerFirstName,
                        surname = x.TrainerSurname,
                        email = x.TrainerEmail
                    })
                    .ToList();
                return Json(users);
            }
        }
                   
        [HttpGet("[action]")]
        public JsonResult GetExistingAdmins()
        {
            using (var context = new GymContext())
            {
                var users = context.Administrator
                    .Select(x => new
                    {
                        id = x.AdminId,
                        firstName = x.AdminFirstName,
                        surname = x.AdminSurname,
                        email = x.AdminEmail
                    })
                    .ToList();
                return Json(users);
            }
        }

        [HttpDelete("[action]/{userId}")]
        public void DeleteUser(int userId)
        {
            using (var context = new GymContext())
            {
                var theUser = context.GymUser
                    .FirstOrDefault(x => x.UserId == userId);
                
                context.Attending.RemoveRange(context.Attending
                    .Where(x => x.UserId == userId)
                    .ToList());
                context.Waiting.RemoveRange(context.Waiting
                    .Where(x => x.UserId == userId)
                    .ToList());
                
                if (theUser != null)
                {
                    context.GymUser.Remove(theUser); 
                }
                
                context.SaveChanges();
            }
        }
        
        [HttpDelete("[action]/{trainerId}")]
        public void DeleteTrainer(int trainerId)
        {
            using (var context = new GymContext())
            {
                var theTrainer = context.GymTrainer
                    .FirstOrDefault(x => x.TrainerId == trainerId);
                
                var bookingToDelete = context.Booking
                    .Where(x => x.TrainerId == trainerId)
                    .ToList();

                var bookingIds = context.Booking
                    .Where(x => x.TrainerId == trainerId)
                    .Select(x => x.BookingId)
                    .ToList();

                context.Booking.RemoveRange(bookingToDelete);
                context.Attending.RemoveRange(context.Attending
                    .Where(x => bookingIds.Contains(x.BookingId))
                    .ToList());
                context.Waiting.RemoveRange(context.Waiting
                    .Where(x => bookingIds.Contains(x.BookingId))
                    .ToList());
                
                if (theTrainer != null)
                {
                    context.GymTrainer.Remove(theTrainer); 
                }
                
                context.SaveChanges();
            }
        }
        
        [HttpDelete("[action]/{adminId}")]
        public void DeleteAdmin(int adminId)
        {
            using (var context = new GymContext())
            {
                var theAdmin = context.Administrator
                    .FirstOrDefault(x => x.AdminId == adminId);
                
                if (theAdmin != null)
                {
                    context.Administrator.Remove(theAdmin); 
                }
                
                context.SaveChanges();
            }
        }
    }
}