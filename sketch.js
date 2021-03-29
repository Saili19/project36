var dog,dogImg,happyDog,database ,foodS, foodStock;
var feed,addFood;
var fedTime,lastFed;
var foodObj;
var food_stock_val;
 

function preload(){
  dogImg=loadImage("Images/Dog.png");
  happyDog=loadImage("Images/happy dog.png");
}

function setup() {

  database = firebase.database();
  createCanvas(1000,500);
  
  foodObj = new Food();
  
  foodStock = database.ref("Food");
  foodStock.on("value",readStock);

  dog=createSprite(800,200,150,150);
  dog.addImage(dogImg);
  dog.scale=0.15;

  feed = createButton("Feed the Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}

function draw() {
  background(46,139,87);

  fedTime = database.ref("FeedTime");
  fedTime.on("value",function(data){
    lastFed = data.val();
  })

  fill(255);
  textSize(20);

if(lastFed >= 12){
    text("Last Feed: "+ lastFed % 12 + "PM",350,30);
  }else if(lastFed === 0){
    text("Last Feed: 12 AM",350,30);
  }else{
    text("Last Feed: "+ lastFed + "AM",350,30);
  }

  foodObj.display();
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

//function to update food stock and last fed time
function feedDog(){
dog.addImage(happyDog);

 food_stock_val = foodObj.getFoodStock();
if(food_stock_val <= 0){
  foodObj.updateFoodStock(food_stock_val*0);
}else{
  foodObj.updateFoodStock(food_stock_val-1);
}

database.ref('/').update({
  Food: foodObj.getFoodStock(),
  FeedTime : hour()

})
}

//function to add food in stock
function addFoods(){
  foodS++ ;
database.ref('/').update({
  Food:foodS
});
}