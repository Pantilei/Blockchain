import React from "react";
import Table from "./Table";

const Blocks: React.FC = () => {
  function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number
  ) {
    return [name, calories, fat, carbs, protein];
  }

  const rows = [
    createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
    createData("Eclair", 262, 16.0, 24, 6.0),
    createData("Cupcake", 305, 3.7, 67, 4.3),
    createData("Gingerbread", 356, 16.0, 49, 3.9),
  ];
  const columns = [
    "Dessert (100g serving)",
    "Calories",
    "Fat&nbsp;(g)",
    "Carbs&nbsp;(g)",
    "Protein&nbsp;(g)",
  ];
  return (
    <div>
      <Table rows={rows} columns={columns} />
    </div>
  );
};

export default Blocks;
