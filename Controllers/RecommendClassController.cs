using System;
using System.Collections.Generic;
using System.Linq;
using DAL;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace gym.Controllers
{
    [Route("api/[controller]")]
    public class RecommendClassController: Controller
    {
        [HttpGet("[action]")]
        public JsonResult GetAllFocus()
        {
            using (var context = new GymContext())
            {
                var focusList = context.Class
                    .Select(x => x.Focus)
                    .ToList();
                return Json(focusList);
            }
        }

        [HttpGet("[action]")]
        public JsonResult GetAllDifficulty()
        {
            using (var context = new GymContext())
            {
                var difficultyList = context.Class
                    .Select(x => x.Difficulty)
                    .ToList();
                return Json(difficultyList);
            }
        }

        public List<Tuple<string, List<Class>>> CategoriseClasses(List<Class> classes)
        {
            var beginnerCardio = new List<Class>();
            var intermediateCardio = new List<Class>();
            var advancedCardio = new List<Class>();

            var beginnerStretch = new List<Class>();
            var intermediateStretch = new List<Class>();
            var advancedStretch = new List<Class>();

            var beginnerStrength = new List<Class>();
            var intermediateStrength = new List<Class>();
            var advancedStrength = new List<Class>();

            foreach (var aClass in classes)
            {
                switch (aClass.Difficulty)
                {
                    case "Beginner":
                        switch (aClass.Focus)
                        {
                            case "Cardio":
                                beginnerCardio.Add(aClass);
                                break;

                            case "Stretch":
                                beginnerStretch.Add(aClass);
                                break;

                            case "Strength":
                                beginnerStrength.Add(aClass);
                                break;
                        }

                        break;

                    case "Intermediate":
                        switch (aClass.Focus)
                        {
                            case "Cardio":
                                intermediateCardio.Add(aClass);
                                break;

                            case "Stretch":
                                intermediateStretch.Add(aClass);
                                break;

                            case "Strength":
                                intermediateStrength.Add(aClass);
                                break;
                        }

                        break;

                    case "Advanced":
                        switch (aClass.Focus)
                        {
                            case "Cardio":
                                advancedCardio.Add(aClass);
                                break;

                            case "Stretch":
                                advancedStretch.Add(aClass);
                                break;

                            case "Strength":
                                advancedStrength.Add(aClass);
                                break;
                        }

                        break;
                }
            }

            var treeList = new List<Tuple<string, List<Class>>>();
            treeList.Add(new Tuple<string, List<Class>>("Beginner Cardio", beginnerCardio));
            treeList.Add(new Tuple<string, List<Class>>("Beginner Stretch", beginnerStretch));
            treeList.Add(new Tuple<string, List<Class>>("Beginner Strength", beginnerStrength));
            treeList.Add(new Tuple<string, List<Class>>("Intermediate Cardio", intermediateCardio));
            treeList.Add(new Tuple<string, List<Class>>("Intermediate Stretch", intermediateStretch));
            treeList.Add(new Tuple<string, List<Class>>("Intermediate Strength", intermediateStrength));
            treeList.Add(new Tuple<string, List<Class>>("Advanced Cardio", advancedCardio));
            treeList.Add(new Tuple<string, List<Class>>("Advanced Stretch", advancedStretch));
            treeList.Add(new Tuple<string, List<Class>>("Advanced Strength", advancedStrength));

            return treeList;
        }

        [HttpGet("[action]/{userId}")]
        public Tuple<string, string> CalculateUserValues(int userId)
        {   
            using (var context = new GymContext())
            {
                var difficulty = new List<Tuple<string, int>>();
                var focus = new List<Tuple<string, int>>();

                var beginner = 0;
                var intermediate = 0;
                var advanced = 0;
                var cardio = 0;
                var stretch = 0;
                var strength = 0;
                
                var userAttending = context.Attending
                    .Where(x => x.UserId == userId)
                    .Select(x => x.BookingId)
                    .ToList();
                
                var userWaiting = context.Waiting
                    .Where(x => x.UserId == userId)
                    .Select(x => x.BookingId)
                    .ToList();

                var userBookings = context.Booking
                    .Include(x => x.Class)
                    .Where(x => userAttending.Contains(x.BookingId) || userWaiting.Contains(x.BookingId))
                    .ToList();

                foreach (var booking in userBookings)
                {
                    switch (booking.Class.Difficulty)
                    {
                        case "Beginner":
                            beginner++;
                            break;
                        
                        case "Intermediate":
                            intermediate++;
                            break;
                            
                        case "Advanced":
                            advanced++;
                            break;
                    }

                    switch (booking.Class.Focus)
                    {
                        case "Cardio":
                            cardio++;
                            break;
                        
                        case "Stretch":
                            stretch++;
                            break;
                        
                        case "Strength":
                            strength++;
                            break;
                    }
                }
                
                difficulty.Add(new Tuple<string, int>("Beginner", beginner));
                difficulty.Add(new Tuple<string, int>("Intermediate", intermediate));
                difficulty.Add(new Tuple<string, int>("Advanced", advanced));
                
                focus.Add(new Tuple<string, int>("Cardio", cardio));
                focus.Add(new Tuple<string, int>("Stretch", stretch));
                focus.Add(new Tuple<string, int>("Strength", strength));
                
                difficulty = difficulty.OrderByDescending(x => x.Item2).ToList();
                focus = focus.OrderByDescending(x => x.Item2).ToList();

                Tuple<string, string> favoured;
                if (difficulty[0].Item2.Equals(0) && focus[0].Item2.Equals(0))
                {
                    favoured = new Tuple<string, string>("None", "None");
                }
                else
                {
                    favoured = new Tuple<string, string>(difficulty[0].Item1, focus[0].Item1); 
                }

                return favoured;
            }
        }

        [HttpGet("[action]/{userId}")]
        public JsonResult ReturnUserClassRecommendations(int userId)
        {
            using (var context = new GymContext())
            {
                var classes = context.Class
                    .Where(x => x.Approved == 1)    
                    .ToList();
                var classTree = CategoriseClasses(classes);
                
                var (userDifficultyPreference, userFocusPreference) = CalculateUserValues(userId);
                var userPreferenceString = userDifficultyPreference + " " + userFocusPreference;

                var recommendedClasses = new List<Class>();

                foreach (var (classString, listOfClasses) in classTree)
                {
                    if (classString != userPreferenceString) continue;
                    recommendedClasses = listOfClasses.Count == 0 ? GetAvailableClasses(userId) : listOfClasses;
                    break;
                }

                if (recommendedClasses.Count == 0)
                {
                    recommendedClasses = GetAvailableClasses(userId);
                }
                
                return Json(recommendedClasses);
            }   
        }
            
        
        [HttpGet("[action]/{userId}")]
        public List<Class> GetAvailableClasses(int userId)
        {
            using (var context = new GymContext())
            {
                var availableClasses = new List<Class>();
                var userAttending = context.Attending
                    .Where(x => x.UserId == userId)
                    .Select(x => x.BookingId)
                    .ToList();
                var userWaiting = context.Waiting
                    .Where(x => x.UserId == userId)
                    .Select(x => x.BookingId)
                    .ToList();
                var classes = context.Booking
                    .Include(x => x.Class)
                    .Include(x => x.Attending)
                    .Where(x => x.Attending.Count != x.Room.MaxCapacity 
                                && !userAttending.Contains(x.BookingId) 
                                && !userWaiting.Contains(x.BookingId)
                                && x.DateTime > DateTime.Now)
                    .Select(x => x.Class)
                    .Take(3)
                    .ToList();
                foreach (var aClass in classes)
                {
                    availableClasses.Add(aClass);
                }
                return availableClasses;
            }   
        }
    }
}