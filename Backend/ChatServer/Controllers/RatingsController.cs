#nullable disable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ChatServer.Data;
using ChatServer.Models;
using ChatServer.Services;
namespace ChatServer.Controllers
{
    public class RatingsController : Controller
    {
        private RatingService service;

        public RatingsController(ChatServerContext context)
        {
            service = new RatingService(context);
        }


        // GET: Ratings
        public async Task<IActionResult> Index()
        {
            List<Rating> ratings = await service.GetAll();
            double avg = 0.0;
            if (ratings.Count != 0)
            {
                avg = await service.average();
            }
            ViewData["avg"] = Math.Round(avg, 2);
            return View(ratings); // get the list of the ratings.
        }

        // GET: Ratings/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var rating = await service.Get(id);
            if (rating == null)
            {
                return NotFound();
            }
            return View(rating);
        }

        public async Task<IActionResult> Search(string query)
        {
            return Json(await service.descriptionInclude(query));
        }

        // GET: Ratings/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Ratings/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Name,Score,Text,Date")] Rating rating)
        {
            await service.Create(rating);
            return RedirectToAction(nameof(Index));
            // return View(rating);
        }

        // GET: Ratings/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            Rating rating = await service.Get(id);
            if (rating == null)
            {
                return NotFound();
            }
            return View(rating);
        }

        // POST: Ratings/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Name,Score,Text")] Rating rating)
        {
            if (id != rating.Id)
            {
                return NotFound();
            }
            bool result = await service.Edit(id, rating.Name, rating.Score, rating.Text);
            if(!result)
            {
                return NotFound();
            }
            return RedirectToAction(nameof(Index));
            //            return View(rating); Error
        }

        // GET: Ratings/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var rating = await service.Get(id);
            if (rating == null)
            {
                return NotFound();
            }

            return View(rating);
        }

        // POST: Ratings/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            await service.Delete(id);
            return RedirectToAction(nameof(Index));
        }

    }

}