import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "v1.0.0",
    title: "Haspaka Project",
    description:
      "Simple project for inventory management, made with ExpressJs and Typescript, PostgreSQL with PG-node for DB",
  },
  tags: [
    {
      name: "Users",
      description: "User based routes",
    },
    {
      name: "Commands",
      description:
        "Commands based routes, also substitutes as permissions for users",
    },
    {
      name: "Units",
      description: "All the divisions beneath the commands based routes",
    },
    {
      name: "Items",
      description: "All the items based routes",
    },
    {
      name: "Ideal Inventory",
      description: "All the Ideal Inventory(teken model) based routes"
    },
    {
      name:"Needed Inventory",
      description: "All the Needed Inventory(items that a unit needs) based routes"
    },
    {
      name:"Future Supplied",
      description: "All the Future Supplied(items that a unit will get in the future) based routes"
    }
  ],
  servers: [
    {
      url: "http://localhost:5000",
      description: "dev environment",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {
      // commands schemas
      addCommand: {
        command_name: "command name",
      },
      patchCommand: {
        $command_name: "command name",
      },
      deleteCommand: {
        $commands_ids: [1, 2, 3],
      },
      // users schemas
      login: {
        $username: "user",
        $password: "pass",
      },
      register: {
        $username: "user",
        $password: "pass",
        $name: "Or",
      },
      patchUser: {
        $command_id: 1,
      },
      // units schemas
      addUnit: {
        unit_name: "unit name",
        command_id: 1,
      },
      patchUnit: {
        unit_name: "unit name",
        command_id: 1,
      },
      deleteUnits: {
        $units_ids: [1, 2, 3],
      },
      //   items schemas
      addItem: {
        item_name: "item name",
        item_type: "חורף",
      },
      patchItem: {
        unit_name: "item name",
        item_type: "שהייה",
      },
      deleteItems: {
        $items_ids: [1, 2, 3],
      },
      // ideal_inventory, needed_inventory and future_supplied schemas
      updateValue: {
        $item_id: 1,
        $unit_id: 1,
        $value: 123,
      },
    },
  },
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./src/app.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
