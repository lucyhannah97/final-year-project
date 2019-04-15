using System;
using DAL;
using System.Linq;
using Microsoft.AspNetCore.Mvc;

namespace gym.Controllers
{
    [Route("api/[controller]")]
    public class NoticesDataController : Controller
    {
        
        [HttpGet("[action]")]
        public JsonResult ApprovedNotices(){
            using(var context = new GymContext())
            {
                var notices = context.Notices
                    .Where(x => x.Approved == 1)
                    .Select(x => new
                    {
                        id = x.NoticeId,
                        dateTime = x.DateTime,
                        message = x.Message,
                        approved = x.Approved
                    })
                    .ToList();
                return Json(notices);
            }
        } 
        
        [HttpGet("[action]")]
        public JsonResult NoticesAwaiting(){
            using(var context = new GymContext())
            {
                var notices = context.Notices
                    .Where(x => x.Approved == 0)
                    .Select(x => new
                    {
                        id = x.NoticeId,
                        dateTime = x.DateTime,
                        message = x.Message,
                        approved = x.Approved
                    })
                    .OrderBy(x => x.dateTime)
                    .ToList();
                return Json(notices);
            }
        }   
        
        [HttpPost("[action]")]
        public void AddNotice(string userType, string message)
        {
            using (var context = new GymContext())
            {
                switch (userType)
                {
                    case "trainer":
                        context.Notices.Add(new Notices
                        {
                            DateTime = DateTime.Now,
                            Message = message,
                            Approved = 0
                        });
                        context.SaveChanges();
                        break;
                    
                    default:
                        context.Notices.Add(new Notices
                        {
                            DateTime = DateTime.Now,
                            Message = message,
                            Approved = 1
                        });
                        context.SaveChanges();
                        break;
                }
            }
        }
        
        // Delete a booking
        [HttpDelete("[action]/{noticeId}")]
        public void DeleteNotice(int noticeId)
        {
            using (var context = new GymContext())
            {
                var noticeToDelete = context.Notices
                    .FirstOrDefault(x => x.NoticeId == noticeId);
                if (noticeToDelete != null)
                {
                    context.Notices.Remove(noticeToDelete);
                }
                context.SaveChanges();
            }
        }

        [HttpPut("[action]/{noticeId}")]
        public bool ApproveNotice(int noticeId)
        {
            using (var context = new GymContext())
            {
                var theNotice = context.Notices
                    .FirstOrDefault(x => x.NoticeId == noticeId);
                
                if (theNotice != null)
                {
                    theNotice.Approved = 1;
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