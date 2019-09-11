using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkProject.Data;
using WorkProject.Models;

namespace WorkProject.Controllers
{
    [Route("api/[controller]")]
    public class OrderDetailsController : Controller
    {
        private readonly ApplicationDbContext _db;

        public OrderDetailsController(ApplicationDbContext db)
        {
            _db = db;
        }

        // GET: api/OrderDetails
        [HttpGet("[action]")]
        [Authorize(Policy = "RequireLoggedIn")]
        public IActionResult GetOrderDetails()
        {
            return Ok(_db.OrderDetails.ToList());
        }

        // GET: api/OrderDetails/5
        [HttpGet("[action]")]
        [Authorize(Policy = "RequireLoggedIn")]
        public IActionResult GetOrderDetail([FromRoute] int id)
        {
            OrderDetail orderDetail = _db.OrderDetails.Find(id);
            if (orderDetail == null)
            {
                return NotFound();
            }

            return Ok(orderDetail);
        }

        // PUT: api/OrderDetails/5
        [HttpPut("[action]/{id}")]
        [Authorize(Policy = "RequireLoggedIn")]
        public  IActionResult PutOrderDetail([FromRoute] int id, [FromBody] OrderDetail orderDetail)
        {
       
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != orderDetail.OrderID)
            {
                return BadRequest();
            }

            _db.Entry(orderDetail).State = EntityState.Modified;

            try
            {
                _db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderDetailExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/OrderDetails
        [HttpPost("[action]")]
        
        public IActionResult PostOrderDetail([FromBody] OrderDetail orderDetail)
        
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            orderDetail.IP = "";
            orderDetail.IsConfirmed = false;
            orderDetail.OrderDate = DateTime.Now;
            orderDetail.Status = "Placed";

            _db.OrderDetails.Add(orderDetail);
            _db.SaveChanges();

            //return CreatedAtRoute("DefaultApi", new { id = orderDetail.OrderID }, orderDetail);
            return Ok(orderDetail.OrderID);
        }

        // DELETE: api/OrderDetails/5
        [Authorize(Policy = "RequireLoggedIn")]
        [HttpDelete("[action]/{id}")]
        public IActionResult DeleteOrderDetail([FromRoute] int id)
        {
            OrderDetail orderDetail = _db.OrderDetails.Find(id);
            if (orderDetail == null)
            {
                return NotFound();
            }

            _db.OrderDetails.Remove(orderDetail);
            _db.SaveChanges();

            return Ok(orderDetail);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool OrderDetailExists([FromRoute] int id)
        {
            return _db.OrderDetails.Count(e => e.OrderID == id) > 0;
        }
    }
}