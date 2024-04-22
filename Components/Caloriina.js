import { parseDurationToSeconds } from "../helpers/Functions";

const CaloriinaCalculator = ({ workoutType, time, distance }) => {

    const parsedDuration = parseDurationToSeconds(time)

    // Define calorie burn rates for different workout types (calories burned per minute per kg)
    const calorieBurnRates = {
      running: 0.12, // calories burned per minute per kg while running
      walking: 0.05, // calories burned per minute per kg while walking
      cycling: 0.08, // calories burned per minute per kg while cycling
    };
  
    // Calculate total calories burned based on the formula: calories = burn rate * weight * (durationInSeconds / 60)
    // For simplicity, we assume a constant weight (e.g., 70 kg)
    const weight = 70; // kg
    const burnRate = calorieBurnRates[workoutType] || 0; // get the burn rate based on workout type
    const totalCaloriesBurnedFromDuration = burnRate * weight * (parsedDuration / 60); // calories burned from duration
  
    // Calculate total calories burned based on the formula: calories = energy expenditure * weight
    // Energy expenditure (in kcal/kg/km) varies by activity type
    const energyExpenditure = {
      running: 1.036, // kcal/kg/km
      walking: 0.455, // kcal/kg/km
      cycling: 0.30, // kcal/kg/km
    };
  
    const energyExpenditureRate = energyExpenditure[workoutType] || 0; // get the energy expenditure rate based on workout type
    const totalCaloriesBurnedFromDistance = energyExpenditureRate * weight * (distance / 1000); // calories burned from distance
  
    // Total calories burned from both duration and distance
    const totalCaloriesBurned = totalCaloriesBurnedFromDuration + totalCaloriesBurnedFromDistance;
  
    // Return the calculated total calories burned
    return totalCaloriesBurned.toFixed(2);
  };
  
export default CaloriinaCalculator;