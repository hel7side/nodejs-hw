//Middleware 404(після всіх маршрутів) для обробки всіх запитів, що не відповідають жодному наявному маршруту.
export const notFoundHandler = ((req, res)=>{
  res.status(404).json({message: 'Route not found'});
});
