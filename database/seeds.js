const mongoose = require("./connect");
const TourModel = require("./models/tour_model");
const faker = require("faker");

const tourPromises = [];
for (let i = 0; i < 10; i++) {
  console.log(`Creating tour ${i + 1}`);
  tourPromises.push(
    TourModel.create({
      title: faker.address.city(),
      image: faker.image.imageUrl(300, 300, "holiday"),
      price: Math.floor(Math.random() * 50000) + 10000,
      description: faker.lorem.paragraphs(4),
      duration: `${Math.floor(Math.random() * 14) + 1} days`
    })
  );
}

Promise.all(tourPromises)
  .then(tours => {
    console.log(`Seeds file successful, created ${tours.length}`);
  })
  .catch(err => {
    console.log(`Seeds file had an error: ${err}`);
  })
  .finally(() => mongoose.disconnect());
