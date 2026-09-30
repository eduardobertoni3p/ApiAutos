using System.ComponentModel.DataAnnotations;

namespace ApiAutos.Models;

public class Auto
{

    [Key]
    public int AutoID { get; set; }
    public string? Marca { get; set; }
    public string? Modelo { get; set; }
    public int? Anio { get; set; }
    public string? Patente { get; set; }
    public int? Km { get; set; }
    public DateTime? FechaIngreso { get; set; }
    public bool Disponible { get; set; }

}
