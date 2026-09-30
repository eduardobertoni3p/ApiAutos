using Microsoft.EntityFrameworkCore;
using ApiAutos.Models;

namespace ApiAutos.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Auto> Autos { get; set; }

}
