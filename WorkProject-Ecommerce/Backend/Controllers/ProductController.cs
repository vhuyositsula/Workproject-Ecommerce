using System;
using System.Collections.Generic;
using System.Linq;
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
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _db;

        public ProductController(ApplicationDbContext db)
        {
            _db = db;
        }


        //to get all the product in the database
        //GET: api/Product/GetProducts
        [HttpGet("[action]")]
        [Authorize(Policy = "RequireLoggedIn")]
        public  IActionResult GetProducts()
        {
              return Ok(_db.Products.ToList());
        }


        //no exception yet
        //Adding new product on the database
        //POST: api/Product/AddProduct
        [HttpPost("[action]")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> AddProduct([FromBody] ProductModel formdata)
        {
            var newProduct = new ProductModel
            {
                Name = formdata.Name,
                ImgUrl = formdata.ImgUrl,
                Description = formdata.Description,
                OutOfStock = formdata.OutOfStock,
                Price = formdata.Price,
                Quantity = formdata.Quantity
            };

            await _db.Products.AddAsync(newProduct);

             await _db.SaveChangesAsync();

            return Ok(new JsonResult("The product was added successfully"));
        }


        //Updating product on the database
        //POST: api/Product/UpdateProduct/{id}
        [HttpPut("[action]/{id}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> UpdateProduct([FromRoute] int id, [FromBody] ProductModel formdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findProduct = _db.Products.FirstOrDefault(p => p.ProductId == id);

            if (findProduct == null)
            {
                return NotFound();
            }
            else
            {
                //when product is found
                findProduct.Name = formdata.Name;
                findProduct.Description = formdata.Description;
                findProduct.ImgUrl = formdata.ImgUrl;
                findProduct.OutOfStock = formdata.OutOfStock;
                findProduct.Price = formdata.Price;
                findProduct.Quantity = formdata.Quantity;

                _db.Entry(findProduct).State = EntityState.Modified;

                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The product with id " + id + " is updated"));
            }
        }

        //DELETE product on the database
        //POST: api/Product/DeleteProduct/{id}
        [Authorize(Policy = "RequireAdminRole")]
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeleteProduct([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //finding the product

            var findProduct = await _db.Products.FindAsync(id);

            if (findProduct == null)
            {
                return NotFound();
            }
            else
            {
                _db.Products.Remove(findProduct);

                await _db.SaveChangesAsync();

                return Ok(new JsonResult("The product with id " + id + " is deleted"));
            }
        }
    }
}