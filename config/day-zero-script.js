import 'dotenv/config'
import { MongoClient } from 'mongodb';
// Connection URL
const url = process.env.KAAM_MONGODB_URI; // Change this to your MongoDB server URL
  const dbName = new URL(url).pathname.substring(1)

async function main() {
  // Create a new MongoClient
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // Connect the client to the server
    await client.connect();

    console.log('Connected successfully to server');

    const db = client.db(dbName);
    const collection = db.collection('appconfig');

    // Clean the collection
    await collection.deleteMany({});

    console.log('Collection cleaned');

    // Insert the new data
    const data = {
      allowedjobapplication: 5,
      allowedjobposting: 5,
      superadminotp: ['9511263532', '8928843887'],
      supportphone: ['8928843887', '9511263532'],
      supportemail: ['mailmepeter2@gmail.com', 'peterkhalko1122@gamil.com'],
      roles: ['admin', 'employee', 'employer', 'superadmin'],
      isActive:true
      
    };

    await collection.insertOne(data);

    console.log('Data inserted successfully');
  } catch (err) {
    console.error(err.stack);
  }

  // Close the connection
  await client.close();
}

main().catch(console.error);
