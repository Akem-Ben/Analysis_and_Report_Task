const { getTrips, getDriver, getVehicle } = require('api');
/**
 * This function should return the data for drivers in the specified format
 *
 * Question 4
 *
 * @returns {any} Driver report data
 */
 async function driverReport() {
  // Your code goes here
  let newReport = await getTrips();
  let driverId = []
  let cashTrips = {};
  let nonCashTrips = {};
  let totalEarnings = {};
  let cashAmount = {};
  let nonCashAmount = {};
  for (let elem of newReport) {
    //getting unique drivers Id 
    if(!driverId.includes(elem['driverID'])) {
      driverId.push(elem['driverID']);
    }
    // checking if the cash is true to implement count
    if (elem['isCash']) {
      if (cashTrips[elem.driverID]) {
        cashTrips[elem.driverID]++;
      }
      else {
        cashTrips[elem.driverID] = 1;
      }
    }
    if (!elem['isCash']) {
      if (nonCashTrips[elem.driverID]) {
        nonCashTrips[elem.driverID]++;
      }
      else {
        nonCashTrips[elem.driverID] = 1;
      }
    }
    if(totalEarnings[elem.driverID]) {
      totalEarnings[elem.driverID] += parseFloat(String(elem.billedAmount).split(',').join(''));
    }
    else {
      totalEarnings[elem.driverID] = parseFloat(String(elem.billedAmount).split(',').join(''));
    }
    if (elem.isCash) {
      if (cashAmount[elem.driverID]) {
        cashAmount[elem.driverID] += parseFloat(String(elem['billedAmount']).split(',').join(''));
      }
      else{
        cashAmount[elem.driverID] = parseFloat(String(elem['billedAmount']).split(',').join(''));
      }
    }
    if (!elem.isCash) {
      if (nonCashAmount[elem.driverID]) {
        nonCashAmount[elem.driverID] += parseFloat(String(elem['billedAmount']).split(',').join(''));
      }
      else{
        nonCashAmount[elem.driverID] = parseFloat(String(elem['billedAmount']).split(',').join(''));
      }
    }
}
  let cashTripsInfo = Object.values(cashTrips);
  let nonCashTripsInfo = Object.values(nonCashTrips);
  let totalEarningsInfo = Object.values(totalEarnings);
  let totalCash = Object.values(cashAmount);
  let totalNonCash = Object.values(nonCashAmount);
  let driverDetails = []
  for (let m of driverId) {
    driverDetails.push(getDriver(m));
  }
  let promiseDriverInfo = await Promise.allSettled(driverDetails);
  let correctDriverInfo = [];
  //getting drivers status that are fulfilled
  for (let elem of promiseDriverInfo) {
    if(elem['status'] === 'fulfilled') {
      correctDriverInfo.push(elem);
    }
  }
  //getting number of trips per driver
  const driverTrips = {};
  for(let element of newReport) {
    if(driverTrips[element.driverID]){
      driverTrips[element.driverID]++;
    }
    // if key doesnt exist set key value to 1
    else {
      driverTrips[element.driverID] = 1;
    }
  }
  //to get the values of driverTrips alone
  let numOfTrips = Object.values(driverTrips);
  //getting vehicleID and information
  let vehicle = [];
  let vehicleInformation = [];
  for(let element of correctDriverInfo) {
    if (!vehicle.includes(element.value['vehicleID'])){
      vehicle.push(element.value.vehicleID)
    }
  }
  for(let elem of vehicle) {
    if(!vehicle.includes['vehicleID']) {
      vehicleInformation.push(getVehicle(elem))
    }
  }
  let promiseVehicleInfo = await Promise.allSettled(vehicleInformation)
  //sort out the fulfilled status
   let correctVehicleInfo = [];
   for (let elem of promiseVehicleInfo) {
    if (elem['status'] === 'fulfilled') {
      correctVehicleInfo.push(elem);
    }
   }
  //getting vehicles plate and manufacturer
   let vehiclesPlate;
   let vehicleDetails = [];
   for (let elem in correctVehicleInfo) {
    vehiclesPlate = {}
    vehiclesPlate['plate'] = correctVehicleInfo[elem].value.plate;
    vehiclesPlate['manufacturer'] = correctVehicleInfo[elem].value.manufacturer;
    vehicleDetails.push(vehiclesPlate);
   }
  //  user information
  let userDetails = [];
  for (let elem in newReport) {
    let userInfo = {}
    userInfo['user'] = newReport[elem].user.name;
    userInfo['created'] = newReport[elem].created;
    userInfo['pickup'] = newReport[elem].pickup;
    userInfo['destination'] = newReport[elem].destination;
    userInfo['billed'] = newReport[elem].billedAmount;
    userInfo['isCash'] = newReport[elem].isCash;
    userDetails.push(userInfo)
  }
  //computing driver information
  let driverArray = [];
  for (let elem in correctDriverInfo) {
    let driverInfo = {};
    if (correctDriverInfo[elem]) {
      driverInfo['fullName'] = correctDriverInfo[elem].value.name;
      driverInfo['id'] = driverId[elem];
      driverInfo['phone'] = correctDriverInfo[elem].value.phone;
      driverInfo['noOfTrips'] = numOfTrips[elem];
      driverInfo['noOfVehicles'] = (correctDriverInfo[elem].value.vehicleID).length;
      driverInfo['vehicles'] = [];
      driverInfo['vehicles'].push(vehicleDetails[elem]);
      driverInfo['noOfCashTrips'] = cashTripsInfo[elem];
      driverInfo['noOfNonCashTrips'] = nonCashTripsInfo[elem];
      driverInfo['totalAmountEarned'] = +(totalEarningsInfo[elem]).toFixed(2);
      driverInfo['totalCashAmount'] = totalCash[elem];
      driverInfo['totalNonCashAmount'] = +(totalNonCash[elem].toFixed(2));
      driverInfo['trips'] = userDetails[elem];
    }
    driverArray.push(driverInfo);
  }
return driverArray;
}

driverReport()
module.exports = driverReport;