using System.Linq;
using DAL;
using Microsoft.AspNetCore.Mvc;

namespace gym.Controllers
{
    [Route("api/[controller]")]
    public class ClassDataController : Controller
    {
        // Return all class info for all classes the gym offers, ordered alphabetically
        [HttpGet("[action]")]
        public JsonResult GetAllClasses()
        {
            using (var context = new GymContext())
            {
                var classes = context.Class
                    .Where(x => x.Approved == 1)
                    .OrderBy(x => x.ClassName)
                    .ToList();
                return Json(classes);
            }
        }

        [HttpGet("[action]")]
        public JsonResult GetAllClassIds()
        {
            using (var context = new GymContext())
            {
                var ids = context.Class
                    .Select(x => x.ClassId)
                    .ToList();
                return Json(ids);
            }
        }
        
        // Return all class info for all classes that are waiting for admin approval
        [HttpGet("[action]")]
        public JsonResult GetAllClassesAwaitingApproval()
        {
            using (var context = new GymContext())
            {
                var classes = context.Class
                    .Where(x => x.Approved == 0)
                    .OrderBy(x => x.ClassName)
                    .ToList();
                return Json(classes);
            }
        }
        
        // Get class information for a specific class
        [HttpGet("[action]/{id}")]
        public JsonResult GetClassInfo(int id)
        {
            using (var context = new GymContext())
            {
                var aClass = context.Class
                    .FirstOrDefault(x => x.ClassId == id);
                return Json(aClass);
            }
        }
        
        // Get class information for a specific list of classes
//        [HttpPost("[action]")]
//        public JsonResult GetMultipleClassInfo([FromBody] List<int> classIds)
//        {
//            using(var context = new GymContext())
//            {
//                var classes = context.Class
//                    .Where(x => classIds.Contains(x.ClassId))
//                    .ToList();
//                return Json(classes);
//            }
//        }
        
        // Update class information for a specific class
        [HttpPut("[action]")]
        public bool UpdateClassInfo(int id, string name, string desc, string focus, string diff)
        {
            using (var context = new GymContext())
            {
                var theClass = context.Class
                    .FirstOrDefault(x => x.ClassId == id);
                
                if (theClass != null)
                {
                    theClass.ClassName = name;
                    theClass.ClassDesc = desc;
                    theClass.Focus = focus;
                    theClass.Difficulty = diff;
                    context.SaveChanges();
                }
                else
                {
                    return false;
                }

                return true;
            }
        }
        
        // Get all class names
        [HttpGet("[action]")]
        public JsonResult GetAllClassNames()
        {
            using (var context = new GymContext())
            {
                var names = context.Class
                    .Where(x => x.Approved == 1)
                    .Select(x => new
                        {
                            id = x.ClassId,
                            name = x.ClassName,
                            roomReq = x.RoomReq
                        })
                    .OrderBy(x => x.name)
                    .ToList();
                return Json(names);
            }
        }
        
        // Get all rooms 
        [HttpGet("[action]")]
        public JsonResult GetAllRooms()
        {
            using (var context = new GymContext())
            {
                var rooms = context.Room
                    .Select(x => new
                    {
                        id = x.RoomId,
                        name = x.RoomName,
                        specialReq = x.SpecialReq,
                        maxCapacity = x.MaxCapacity
                    })
                    .ToList();
                return Json(rooms);
            }
        }

        [HttpPost("[action]")]
        public void SuggestClass(string title, string desc, string focus, string diff, int approved)
        {
            using (var context = new GymContext())
            {
                context.Class.Add(new Class
                {
                    ClassName = title,
                    ClassDesc = desc,
                    Focus = focus,
                    Difficulty = diff,
                    Approved = approved
                });
                context.SaveChanges();
            }
        }
        
        // Delete a class
        [HttpDelete("[action]/{classId}")]
        public void DeleteClass(int classId)
        {
            using (var context = new GymContext())
            {
                var classToDelete = context.Class
                    .FirstOrDefault(x => x.ClassId == classId);
                
                var bookingsToDelete = context.Booking
                    .Where(x => x.ClassId == classId)
                    .Select(x => x.BookingId)
                    .ToList();
                
                context.Attending.RemoveRange(context.Attending
                    .Where(x => bookingsToDelete.Contains(x.BookingId))
                    .ToList());
                context.Waiting.RemoveRange(context.Waiting
                    .Where(x => bookingsToDelete.Contains(x.BookingId))
                    .ToList());
                
                if (classToDelete != null)
                {
                    context.Class.Remove(classToDelete);
                }
                context.SaveChanges();
            }
        }

        [HttpPut("[action]/{classId}")]
        public bool ApproveClass(int classId)
        {
            using (var context = new GymContext())
            {
                var theClass = context.Class
                    .FirstOrDefault(x => x.ClassId == classId);
                
                if (theClass != null)
                {
                    theClass.Approved = 1;
                    context.SaveChanges();
                }
                else
                {
                    return false;
                }

                return true;
            }
        }
    }
    
}
