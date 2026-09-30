using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiAutos.Data;
using ApiAutos.Models;

namespace ApiAutos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AutoController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AutoController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Auto>>> GetAutos()
        {
            return await _context.Autos.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Auto>> GetAuto(int id)
        {
            var auto = await _context.Autos.FindAsync(id);

            if (auto == null)
            {
                return NotFound();
            }

            return auto;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutAuto(int id, Auto auto)
        {
            if (id != auto.AutoID)
            {
                return BadRequest();
            }

            string? error = ValidarAuto(auto);
            if (error != null)
            {
                return BadRequest(error);
            }

            _context.Entry(auto).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AutoExists(id))
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

        [HttpPost]
        public async Task<ActionResult<Auto>> PostAuto(Auto auto)
        {
            string? error = ValidarAuto(auto);
            if (error != null)
            {
                return BadRequest(error);
            }

            _context.Autos.Add(auto);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAuto", new { id = auto.AutoID }, auto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAuto(int id)
        {
            var auto = await _context.Autos.FindAsync(id);
            if (auto == null)
            {
                return NotFound();
            }

            if (auto.Disponible == true)
            {
                return BadRequest("El vehículo está disponible, no puede ser eliminado.");
            }

            _context.Autos.Remove(auto);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AutoExists(int id)
        {
            return _context.Autos.Any(e => e.AutoID == id);
        }

        private string? ValidarAuto(Auto auto)
        {
            if (string.IsNullOrWhiteSpace(auto.Marca) ||
                string.IsNullOrWhiteSpace(auto.Modelo) ||
                auto.Anio == null ||
                string.IsNullOrWhiteSpace(auto.Patente) ||
                auto.Km == null ||
                auto.FechaIngreso == null)
            {
                return "Todos los campos son obligatorios.";
            }

            if (auto.Modelo.Trim().Length < 2)
            {
                return "El modelo debe tener al menos 2 caracteres.";
            }

            if (auto.Km < 0)
            {
                return "Los kilómetros no pueden ser negativos.";
            }

            return null;
        }
    }
}
