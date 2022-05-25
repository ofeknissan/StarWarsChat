using ChatServer.Data;
using ChatServer.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace ChatServer.Services
{
    public class RatingService
    {
        private readonly ChatServerContext _context; 
        public RatingService(ChatServerContext context)
        {
            _context = context;
        }
        public async Task<List<Rating>> GetAll()
        {
            return await _context.Rating.ToListAsync();
        }
        public async Task<Rating> Get(int ?id)
        {
            var list = await GetAll();
            return list.Find(x => x.Id == id);
        }

        public async Task<bool> Edit(int id, string name, int score, string text)
        { 
            Rating rating = await Get(id);
            if(rating == null)
            {
                return false;
            } 
            rating.Name = name;
            rating.Score = score;
            rating.Text = text;
            _context.Update(rating);
            await _context.SaveChangesAsync();
            return true;
        }
        //public async Task<bool> Details(int? id)
        //{
        //    Rating rating = await Get(id);
        //    if (rating == null)
        //    {
        //        return false;
        //    }

        //}
        public async Task Create(Rating rating)
        {
            rating.Date = DateTime.Now.ToString("dd/MM/yyyy HH:mm");
            List<Rating> list = await GetAll();
            if (list.Count == 0)
            {
                rating.Id = 1;
            }
            else
            {
                rating.Id = _context.Rating.Max(u => u.Id) + 1;
            }
            await _context.Rating.AddAsync(rating);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var rating = await Get(id);
            _context.Rating.Remove(rating);
            await _context.SaveChangesAsync();
        }

        public async Task<double> average()
        {
            return _context.Rating.Average(c => c.Score);
        }

        public async Task<List<Rating>> descriptionInclude(string query)
        {
            if (query == null)
            {
                return await _context.Rating.ToListAsync();
            }
            var q = from rating in _context.Rating
                    where  rating.Text.Contains(query)
                    select rating;

            return (await q.ToListAsync());
        }

        public bool isEmpty()
        {
            return _context.Rating.Any();
        }
    }
}
