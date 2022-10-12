const { getTrips, getDriver, getVehicle } = require('api');
/**
 * This function should return the trip data analysis
 *
 * Question 3
 * @returns {any} Trip data analysis
 */
async function analysis() {
    // Your code goes here
    let finalOutput = {
      "noOfCashTrips": 0,
      "noOfNonCashTrips": 0,
      "billedTotal": 0,
      "cashBilledTotal": 0,
      "nonCashBilledTotal": 0,
      "noOfDriversWithMoreThanOneVehicle": 0,
      "mostTripsByDriver": {
        "name": " ",
        "email": " ",
        "phone": " ",
        "noOfTrips": 0,
        "totalAmountEarned": 0
      },
      "highestEarningDriver": {
        "name": " ",
        "email": " ",
        "phone": " ",
        "noOfTrips": 0,
        "totalAmountEarned": 0
      }
    }
    let sumCashBilledTotal = 0;
    let sumNonCashBilledTotal = 0;
    let sumAllCashBilledTotal = 0;
    let trips = await getTrips();
    let arr = [];
    let driversInfo = new Map();
    trips.forEach((trip, index) => {
      arr.push(trip.driverID);
      sumAllCashBilledTotal += Number(billedTotal(trip["billedAmount"]).toFixed(2))
      finalOutput.billedTotal = Number(sumAllCashBilledTotal.toFixed(2))
      if (trip.isCash) {
        finalOutput.noOfCashTrips++
        sumCashBilledTotal += Number(billedTotal(trip["billedAmount"]).toFixed(2))
        finalOutput.cashBilledTotal = Number(sumCashBilledTotal.toFixed(2));
      } else {
        finalOutput.noOfNonCashTrips++
        sumNonCashBilledTotal += Number(billedTotal(trip["billedAmount"]).toFixed(2));
        finalOutput.nonCashBilledTotal =  Number(sumNonCashBilledTotal.toFixed(2))
      }
      // const driverID = trip.driverID
      let driverID = trip.driverID
      let driverDetails = driversInfo.get(driverID)
      if (driverDetails) {
        driversInfo.set(driverID, {
            driverID,
            noOfTrips: driverDetails.noOfTrips + 1,
        })  
    } else {
        driversInfo.set(driverID, {
            driverID,
            noOfTrips: 1,
        })
      }
    })
    let unique = [...new Set(arr)];
    let results = await Promise.allSettled(unique.map((item) => getDriver(item)
    .then((res) => {return res})));
   //console.log(results)
    results.map((item, index) => {
    if(item.status === "fulfilled"){
      if(item.value.vehicleID.length > 1){
        finalOutput.noOfDriversWithMoreThanOneVehicle++
      }
    }
  })
    let values = [...driversInfo.values()]
    let driverWithMostTrips = values.sort((a, b) => b.noOfTrips - a.noOfTrips)[0];
    let highestEarningDriver =  values.sort((a, b) => b.noOfTrips - a.noOfTrips)[1]
    let mostTrips = await getDriver(driverWithMostTrips.driverID);
    let highestEarning = await getDriver(highestEarningDriver.driverID);
    finalOutput.mostTripsByDriver.name = mostTrips.name;
    finalOutput.mostTripsByDriver.email = mostTrips.email;
    finalOutput.mostTripsByDriver.phone = mostTrips.phone;
    finalOutput.mostTripsByDriver.noOfTrips = driverWithMostTrips.noOfTrips;
    trips.forEach((trip) => {
      if(trip.driverID === driverWithMostTrips.driverID){
        finalOutput.mostTripsByDriver.totalAmountEarned += billedTotal(trip["billedAmount"]);
      }
      if(trip.driverID === highestEarningDriver.driverID){
        finalOutput.highestEarningDriver.totalAmountEarned += billedTotal(trip["billedAmount"]);
      }
    })
    finalOutput.highestEarningDriver.name= highestEarning.name;
    finalOutput.highestEarningDriver.email = highestEarning.email;
    finalOutput.highestEarningDriver.phone = highestEarning.phone;
    finalOutput.highestEarningDriver.noOfTrips = highestEarningDriver.noOfTrips;
    console.log(finalOutput)
  }
// function earnings()//
  function billedTotal(str){
    return Number(str.toString().replaceAll(/,/g, ""))
  }
analysis()
module.exports = analysis;