import Experience from "../Experience";
import Environment from "../Environment";
import EventEmitter from "../Utils/EventEmitter";
import Floor from "./Floor";
import Fox from "./Fox";

export default class World extends EventEmitter {
  constructor() {
    super();

    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    /**
     * Events
     */

    // Resources ready event
    this.resources.on("ready", () => {
      console.log("resources ready");

      this.floor = new Floor();
      this.fox = new Fox();
      this.environment = new Environment();
    });
  }

  update() {
    if (this.fox) this.fox.update();
  }
}
