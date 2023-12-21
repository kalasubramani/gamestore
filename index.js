const pg=require('pg');

//connect to db
const client = new pg.Client('postgres://localhost/gamestore')

//initialize express server
const express = require('express');
const app=express();

//configure port for Express server
const port =8080; ///********** */
app.listen(port,()=>{
  console.log(`listening n port ...${port}`);
})

//cors - library that facilitates front end <-> backend communications
const cors=require('cors');
app.use(cors());

//adding logging thru morgan
const morgan = require('morgan');
app.use(morgan('dev'));

//use parser to parse data in body
app.use(express.json());

const init = async ()=>{
  await client.connect();
  console.log("connected to db");

    // create table to store video games 
  // const SQL = `CREATE TABLE videogames(
  //                   id SERIAL PRIMARY KEY,
  //                   name VARCHAR(100),
  //                   game_description varchar(500),
  //                   no_of_players INT
  //                 );`
  // console.log("table created .")

  // create table to store board games 
  //  const SQL = `CREATE TABLE boardgames(
  //                   id SERIAL PRIMARY KEY,
  //                   name VARCHAR(100),
  //                   game_description varchar(500),
  //                   no_of_players INT
  //                 );`
  // console.log("table created .")

  const SQLvg =`INSERT INTO videogames (name,game_description,no_of_players)
              VALUES('hhh','hhhdsfd',2);`
  await client.query(SQLvg);
  const SQLbg =`INSERT INTO boardgames (name,game_description,no_of_players)
              VALUES('hhh','hhhdsfd',2);`
  const dbresponse =await client.query(SQLbg);
  console.log("data seeded....")

}

init();

//configure Express route - FETCH ALL video games --> GET
//setup express route for this CRUD operation
//make the callback fn async so as to call the client.query() asynchronously
//call back fn i/p : req,res,next
//make try/catch block within callback fn to query db
//write sql query to fetch all video games
//execute the sql query
//get dbresponse.rows
//send dbresponse and status =200 as res from Express server
app.get('/api/video-games', async (req,res,next)=>{
    try{
        console.log("fetching all video games")
        const SQL=`SELECT * FROM videogames;`
        const dbresponse=await client.query(SQL);
        console.log("/api/videogames....dbresponse.rowcount...",dbresponse.rowCount);

        //handle rows=0
        if(!dbresponse.rows.length){
          next(
          {
            name : "No records",
            message: "There are no video games to display."
          }
          )
      }else{
          // set status 200 =ok
          res.status(200).send(dbresponse.rows)
      }
      
      // handleDBResponse(dbresponse,res,200,"There are no video games to display.")
      // res.send(dbresponse.rows);

        }catch(error){
      next(error);
    }
}) 

//configure Express route to fetch a given id ---> GET/:id
//setup express route for this CRUD operation
//make the callback fn async so as to call the client.query() asynchronously
//call back fn i/p : req,res,next
//make try/catch block within callback fn to query db 
//write sql query to fetch video game details for passed-in id
//execute the sql query
//get dbresponse.rows
//send dbresponse and status =200 as res from Express server
app.get('/api/video-games/:id',async (req,res,next)=>{
  try{
    console.log("fetching videogames by id...")
    console.log("req.params",req.params);

    const SQL = `SELECT * FROM videogames
                 WHERE ID= ${req.params.id} `
    const dbresponse = await client.query(SQL);
    console.log("/api/videogames/:id dbresponse  ",dbresponse.rows);
       
    //handle rows=0
    if(!dbresponse.rows.length){
       next(
        {
          name : "Error occured",
          message: `Video game with id ${req.params.id} not available`
        }
       )
    }else{
        // set status 200 =ok
        res.status(200).send(dbresponse.rows)
    }
   // handleDBResponse(dbresponse,res,200,`Video game with id ${req.params.id} not available`)

  }catch(error){
    next(error);
  }

})

//configure Express route to delete a video game ---> DELETE
//setup express route for this CRUD operation
//make the callback fn async so as to call the client.query() asynchronously
//call back fn i/p : req,res,next
//make try/catch block within callback fn to query db 
//write sql query to DELETE video game for passed-in id
//execute the sql query
//get dbresponse.rows
//send dbresponse and status =200 as res from Express server
app.delete('/api/video-games/:id', async (req,res,next)=>{
    try{
      console.log(`deleted record with id ${req.params.id}`)
      const SQL = `DELETE FROM videogames
                   WHERE ID= $1;`
      const dbresponse = await client.query(SQL,[req.params.id]);
      console.log("/api/videogames/:id  DELETE dbresponse....",dbresponse.rows)
      //set status 200 = ok
      res.sendStatus(200);
    }catch(error){
      next(error);
    }
})

//configure Express route to create a video game ---> POST
//setup express route for this CRUD operation
//make the callback fn async so as to call the client.query() asynchronously
//call back fn i/p : req,res,next
//make try/catch block within callback fn to query db 
//write sql query to CREATE new video game for passed-in id
//execute the sql query
//get dbresponse.rows
//send dbresponse and status =200 as res from Express server
app.post('/api/video-games/', async (req,res,next)=>{
    try{
     console.log(`creating new video game named ...`);
     console.log("req.body...",req.body);
     const SQL = `INSERT INTO videogames (name,game_description,no_of_players)
                  VALUES($1,$2,$3)
                  RETURNING *;`
    const dbresponse = await client.query(SQL,[req.body.name,req.body.game_description,req.body.no_of_players]);
    console.log("dbresponse.rows....",dbresponse.rows)
    // set status 201 = new resource created
    res.status(200).send(dbresponse.rows)

    }catch(error){
      next(error);
    }
})

//configure Express route to update a video game ----> PUT
//setup express route for this CRUD operation
//make the callback fn async so as to call the client.query() asynchronously
//call back fn i/p : req,res,next
//make try/catch block within callback fn to query db 
//write sql query to update video game details for passed-in id
//execute the sql query
//get dbresponse.rows
//send dbresponse and status =200 as res from Express server
app.put('/api/video-games/:id',async (req,res,next)=>{
    try{
      console.log(`updating videogame id ..${req.params.id}`)
       const SQL = `UPDATE videogames
                    SET 
                        name = $1,
                        game_description = $2,
                        no_of_players = $3
                    WHERE 
                        id = $4
                    RETURNING * ;  `
       const dbresponse = await client.query(SQL,[req.body.name,req.body.game_description,req.body.no_of_players,req.params.id]);
       console.log("dbresponse...",dbresponse.rows);
      //  set status 200 = ok
       res.status(200).send(dbresponse.rows[0])

    }catch(error){
      next(error);
    }
})

// function handleDBResponse(dbresponse,res,statusCode, statusMessage){
//   console.log("handleDBResponse....rowcount....",dbresponse.rowCount,"statusCode", statusCode,"statusMessage",statusMessage)
//   if(!dbresponse.rows.length){
//     next(
//     {
//       name : "",
//       message: statusMessage
//     }
//     )
// }else{   
//    console.log("sending response ....")
    

//     console.log("handleDBResponse...dbresponse ", dbresponse.rowCount)
//     res.status(statusCode).send(dbresponse.rows);
//     // res.send(dbresponse.rows)
//   }
  
// }

//Error handling
//display user friendly error message when something goes wrong 
app.use((error,req,res,next)=>{
   //in case of error, send back error obj
   res.send(error);
})

//****************MUST BE AT THE END of FILE******************* */
//display user friendly error message when something goes wrong with express routing
app.use('*',(req,res,error)=>{
  //set status 400 = Bad Request
  res.status(400).send("The route entered does not exist.")
})