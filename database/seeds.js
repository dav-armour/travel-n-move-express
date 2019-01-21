const mongoose = require("./connect");
const TourModel = require("./models/tour_model");
const FlightQuoteModel = require("./models/flight_quote_model");
const HotelQuoteModel = require("./models/hotel_quote_model");
const HolidayQuoteModel = require("./models/holiday_quote_model");
const faker = require("faker");

createSeeds()
  .then(() => console.log("Finished creating seeds"))
  .finally(() => {
    mongoose.disconnect();
  });

async function createSeeds() {
  const promises = [];
  let tours = [];
  let users = [];
  promises.push(createTours(), createQuoteUsers());
  await Promise.all(promises)
    .then(response => {
      [tours, users] = response;
      console.log("Finished creating tours and users");
    })
    .catch(err => console.log(err));
  await createQuotes({ tours, users })
    .then(quotes => {
      console.log("Finished creating quotes");
    })
    .catch(console.log);
}

async function createTours(qty = 20) {
  const toursArray = [];
  const tourPromises = [];

  for (let i = 0; i < qty; i++) {
    console.log(`Creating tour ${i + 1}`);
    tourPromises.push(createTour());
  }

  await Promise.all(tourPromises)
    .then(tours => {
      toursArray.push(...tours);
      console.log(`Tour seeds successful, created ${tours.length} tours`);
    })
    .catch(err => {
      console.log(`Tour seeds had an error: ${err}`);
    });

  return toursArray;
}

async function createTour() {
  const tour = await TourModel.create({
    title: faker.address.city(),
    image: faker.image.imageUrl(300, 300, "holiday"),
    price: Math.floor(Math.random() * 50000) + 10000,
    description: faker.lorem.paragraphs(4),
    duration: `${Math.floor(Math.random() * 14) + 1} days`
  });

  return tour;
}

async function createQuoteUsers(qty = 20) {
  const usersArray = [];
  const userPromises = [];

  for (let i = 0; i < qty; i++) {
    console.log(`Creating user ${i + 1}`);
    userPromises.push(createQuoteUser());
  }

  await Promise.all(userPromises)
    .then(users => {
      usersArray.push(...users);
      console.log(`User seeds successful, created ${users.length} users`);
    })
    .catch(err => console.log(err));

  return usersArray;
}

async function createQuoteUser() {
  const user = {
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    telephone: faker.phone.phoneNumber(),
    email: faker.internet.email()
  };
  // await user.setPassword("testing123");
  // await user.save();
  return user;
}

async function createQuotes({ tours, users }) {
  const quotesArray = [];
  const quotePromises = [];
  for (let i = 0; i < users.length; i++) {
    console.log(`Creating quote ${i + 1}`);
    const tour = faker.random.boolean() && faker.random.arrayElement(tours);
    const user = users[i];
    quotePromises.push(createQuote({ tour, user }));
  }

  await Promise.all(quotePromises)
    .then(quotes => {
      quotesArray.push(...quotes);
      console.log(`Quotes seeds successful, created ${quotes.length} quotes`);
    })
    .catch(err => console.log(err));

  return quotesArray;
}

async function createQuote({ tour, user }) {
  const start_date = faker.date.future();
  const days = faker.random.number({ min: 7, max: 30 });
  let end_date = new Date(start_date);
  end_date.setDate(end_date.getDate() + days);
  const quoteDetails = {
    start_date,
    end_date,
    destination: faker.address.city(),
    adults: faker.random.number({ min: 1, max: 4 }),
    children: faker.random.number({ min: 0, max: 4 }),
    flexible_dates: faker.random.boolean(),
    user,
    clientComments: faker.lorem.sentence(10)
  };
  const type = faker.random.arrayElement(["Flight", "Hotel", "Holiday"]);
  let quote = {};
  switch (type) {
    case "Flight":
      quote = await createFlightQuote(quoteDetails);
      break;
    case "Hotel":
      quote = await createHotelQuote(quoteDetails);
      break;
    case "Holiday":
      quote = await createHolidayQuote(quoteDetails);
      break;
    default:
      break;
  }
  return quote;
}

async function createFlightQuote(quoteDetails) {
  const quote = await FlightQuoteModel.create({
    ...quoteDetails,
    origin: faker.address.city(),
    seat_type: faker.random.arrayElement([
      "economy",
      "premium economy",
      "business",
      "first class"
    ]),
    ticket_type: faker.random.arrayElement(["return", "one-way"])
  });

  return quote;
}

async function createHotelQuote(quoteDetails) {
  const quote = await HotelQuoteModel.create({
    ...quoteDetails,
    num_rooms: faker.random.number({ min: 1, max: 3 }),
    num_stars: faker.random.number({ min: 1, max: 5 })
  });

  return quote;
}

async function createHolidayQuote(quoteDetails) {
  const quote = await HolidayQuoteModel.create({
    ...quoteDetails,
    budget_tier: faker.random.arrayElement(["budget", "mid-range", "luxury"])
  });

  return quote;
}
