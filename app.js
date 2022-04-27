const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const Path = require("path");

const dataPath = Path.join(__dirname, "covid19india.db");
app.use(express.json());
let database = null;

const intializeDbAndServer = async () => {
  try {
    const database = await open({
      filename: dataPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("sever Running at http://localhost:3000//");
    });
  } catch (error) {
    console.log(`DB ERROR ${error.message}`);
    process.exit(1);
  }
};
intializeDbAndServer()
//API GET//

const covid19DateOfState = (DbObject)=>{
    return{
        stateId:DbObject.state_id,
        stateName:DbObject.state_name,
        population:DbObject.population,
    }

}

const districtsWhilesList = (DbObject_D)=>{
    return{
        districtId:DbObject_D.district_id,
        districtName:DbObject_D.district_name,
        stateId:DbObject_D.state_id,
        cases:DbObject_D.cases,
        active:DbObject_D.active,
        deaths:DbObject_D.deaths
    }

}

app.get("/states/",async (request,response)=>{

    const getQueryOfStates = `
    SELECT * FROM state`
    const statesarray = await database.all(getQueryOfStates)
    response.send(statesarray.map((eachstate)=>covid19DateOfState(eachstate)))

})

///API-2 GET 
app.get("/states/:statesId",async(request,response)=>{
    const{statesId} = request.params
    const getQueryBasedOnId = `
    SELECT * FROM state WHERE stateId = ${stateId}`
    const stateIdArray = await database.run(getQueryBasedOnId)
    response.send(stateIdArray)
})
///APT-3 POST//
app.post("/districks/",async (request,response)=>{
    const{districtName,stateId,cases,cured,active,deaths} = request.body
    const postingTheDistrict = `
    INERT INTO district(district_name,state_id,cases,cured,active,deaths)
    VALUES 
    ${districtName},
    ${stateId},
    ${cases},
    ${cured},
    ${active},
    ${deaths}`

    await database.run(postingTheDistrict)
    response.send("District Successfully Added")

})

//API4//

app.get("/districts/:districtId",async (request,response)=>{
    const{districtId} = request.params

    const getDistrickIdDetails = `
    SELECT * FROM district WHERE district_id = ${districtId}`
    const detailsOfDistrict =await.database.run(getDistrickIdDetails)
    response.send(districtsWhilesList(detailsOfDistrict))

 //API 5 ///
  app.delete("/districts/:districtId",async (request,response)=>{

    const {districtId} = request.param
    const DeleteTheDistrictId = `
    DELETE * FROM district WHERE district_id = ${districtId}`
    await database.run(DeleteTheDistrictId)
    response.send("District Details Updated")

  })   

//API 6//

app.put("/districts/:districtId",async (request,response)=>{
     const {districtId} = request.param
     const districtsDetails = request.body
     const {districtName,stateId,cases,cured,active,deaths} = districtsDetails

     const UpdatedTheDistrictDetail = `
     UPDATE district
     SET(district_name = ${districtName},state_id = ${stateId},cases = ${cases},cured = ${cured},active = ${active},deaths = ${deaths})`
     await database.run(UpdatedTheDistrictDetail)
     response.send("
District Details Updated")
})
app.get("/states/:stateId/stats/",async (request,response)=>{
     const {districtId} = request.param
     const districtsDetails = request.body
     const {districtName,stateId,cases,cured,active,deaths} = districtsDetails
     const totalDetails = `
     SELECT 
     sum(cases)
     sum(cured)
     sum(active)
     sum(deaths)
     FROM district
     WHERE 
     state_id = ${stateId}`

     const totalCalculated = await.Database.get(totalDetails)
     response.send({
         totalCases:state["SUM(cases)"],
         totalCured:state["SUM(cured)"],
         totalActive:state["SUM(active)"],
         totalDeaths:state["SUM(deaths)"],
     })

})
 app.get("/districts/:districtId/details/",async (request,response)=>{
     const {districtId} = request.param
     const districtsDetails = request.body
     const {districtName,stateId,cases,cured,active,deaths} = districtsDetails
     const stateName = `
     SELECT 
     state.stateName FROM state NATURAL JOIN district ON state.state_id = district.state_id WHERE district_id = ${districtId}`
    const getStateName = await database.get(stateName)
    respone.send({stateName:state.state_name})
 })

