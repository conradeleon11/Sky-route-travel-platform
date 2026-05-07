var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

// 1. Define the policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy => policy.WithOrigins("http://localhost:4200")
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// 2. Use the policy
app.UseCors("AllowAngular");

app.UseHttpsRedirection();
app.MapControllers();
app.Run(); 