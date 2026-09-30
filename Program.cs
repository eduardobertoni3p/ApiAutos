using ApiAutos.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>

{

    options.AddPolicy("AllowAll", policy =>

    {

        policy.AllowAnyOrigin()

              .AllowAnyMethod()

              .AllowAnyHeader();

    });

});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
        ?? throw new InvalidOperationException(
            "Connection string 'DefaultConnection' not found.")
    ));



builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

var carpetaFront = new PhysicalFileProvider(
    Path.Combine(builder.Environment.ContentRootPath, "view"));

app.UseDefaultFiles(new DefaultFilesOptions
{
    FileProvider = carpetaFront
});

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = carpetaFront
});

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
