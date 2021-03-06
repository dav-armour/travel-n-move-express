const mongoose = require("./connect");
const TourModel = require("./models/tour_model");
const FlightQuoteModel = require("./models/flight_quote_model");
const HotelQuoteModel = require("./models/hotel_quote_model");
const HolidayQuoteModel = require("./models/holiday_quote_model");
const EnquiryModel = require("./models/enquiry_model");
const faker = require("faker");

createSeeds()
  .then(() => console.log("Finished creating seeds"))
  .catch(err => console.log(err))
  .finally(() => {
    mongoose.disconnect();
  });

async function createSeeds() {
  const promises = [];
  let tours = [];
  let users = [];
  promises.push(createTours(), createQuoteUsers(), createEnquiries());
  await Promise.all(promises)
    .then(response => {
      [tours, users] = response;
      console.log("Finished creating tours and users and enquiries");
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
  const days = Math.floor(Math.random() * 14) + 1;
  const description = createTourDescription(days);
  const tour = await TourModel.create({
    title: faker.address.city(),
    image: faker.image.nature(300, 300),
    price: Math.floor(Math.random() * 50000) + 10000,
    summary: faker.lorem.words(10),
    description,
    duration: `${days} days`,
    featured: Math.random() < 0.3
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
    clientComments: faker.lorem.sentence(10),
    status: faker.random.arrayElement([
      "new",
      "pending",
      "researching",
      "finalized",
      "declined"
    ])
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
    budget: faker.random.arrayElement(["affordable", "premium", "luxury"])
  });

  return quote;
}

async function createEnquiry() {
  const enquiry = await EnquiryModel.create({
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    subject: faker.lorem.sentences(1),
    message: faker.lorem.paragraphs(4),
    status: faker.random.arrayElement([
      "new",
      "pending",
      "researching",
      "closed"
    ]),
    agent_comments: faker.random.boolean() ? faker.lorem.sentences(5) : ""
  });
  return enquiry;
}

async function createEnquiries(qty = 20) {
  const enquiriesArray = [];
  const enquiryPromises = [];
  for (let i = 0; i < qty; i++) {
    console.log(`Creating Enquiry ${i + 1}`);
    enquiryPromises.push(createEnquiry());
  }

  await Promise.all(enquiryPromises)
    .then(enquiries => {
      enquiriesArray.push(...enquiries);
      console.log(
        `Contact request seeds successful, created ${
          enquiries.length
        } enquiries`
      );
    })
    .catch(err => {
      console.log(`Contact request seeds had an error: ${err}`);
    });

  return enquiriesArray;
}

function createTourDescription(days) {
  let output = `<h1>Tour Overview</h1> \
    <p>${faker.lorem.sentences(20)}</p> \
    <h2>Itinerary</h2>`;
  for (let i = 0; i < days; i++) {
    output += `<p>Day ${i + 1}: ${faker.lorem.sentence()}<p>`;
  }
  output += `<h2>Inclusions</h2> \
  <ul><li>${faker.lorem.sentence()}</li> \
  <li>${faker.lorem.sentence()}</li> \
  <li>${faker.lorem.sentence()}</li> \
  <li>${faker.lorem.sentence()}</li> \
  <li>${faker.lorem.sentence()}</li></ul> \
  <h2>Places you will see</h2> \
  <p><img src="${faker.image.city(200, 200)}"><img src="${faker.image.nature(
    200,
    200
  )}"></p>`;
  return output;
}
