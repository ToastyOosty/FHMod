register("renderOverlay",myRenderOverlay);

var textObject = new Text("hello", 0, 0).setColor(Renderer.RED).setShadow(false).setScale(1.0);
const EntityArmorStand = Java.type("net.minecraft.entity.item.EntityArmorStand");
const EntityItem = Java.type("net.minecraft.entity.item.EntityItem");

const EntityPig = Java.type("net.minecraft.entity.passive.EntityPig");
const EntityChicken = Java.type("net.minecraft.entity.passive.EntityChicken");
const EntityOcelot = Java.type("net.minecraft.entity.passive.EntityOcelot");
const EntityHorse = Java.type("net.minecraft.entity.passive.EntityHorse");
const EntityWolf = Java.type("net.minecraft.entity.passive.EntityWolf");
const EntitySheep = Java.type("net.minecraft.entity.passive.EntitySheep");
const EntityCow = Java.type("net.minecraft.entity.passive.EntityCow");

var pName = [];
standUUID = [];
var playerAnimal = [];

var username = [];
var userAnimal = [];

function myRenderOverlay() {
    if (ChatLib.removeFormatting(Scoreboard.getTitle().toLowerCase()) == "farm hunt") {
        try {
            let stands = World.getAllEntitiesOfType(EntityArmorStand.class);
            let animals = World.getAllEntitiesOfType(EntityPig.class)
                .concat(World.getAllEntitiesOfType(EntityChicken.class))
                .concat(World.getAllEntitiesOfType(EntityOcelot.class))
                .concat(World.getAllEntitiesOfType(EntityHorse.class))
                .concat(World.getAllEntitiesOfType(EntityWolf.class))
                .concat(World.getAllEntitiesOfType(EntitySheep.class))
                .concat(World.getAllEntitiesOfType(EntityCow.class));

            let xText = 0;
            let yText = 10;
            stands.forEach((stand) => { // Checks all stand ran at that moment
                let uuid = stand.getUUID();
                if (stand.getName() != "Armor Stand" && !standUUID.includes(uuid)) { // Makes sure its not a naturally generated one and it hasn't been assigned an animal yet
                    let animalDistArr = [];
                    let animalNameArr = [];
                    let animalPitchArr = [];
                    let {x, y, z} = stand.getPos();
                    let standX = x;
                    let standY = y;
                    let standZ = z;
                    animals.forEach((animal) => {  // Gathers all rendered animals distance from the stand, pitch and name of animal
                                                   // Save to array if distance is less than 5 with a pitch greater than 0.1
                        let {x, y, z} = animal.getPos();
                        let animalX = x;
                        let animalY = y;
                        let animalZ = z;
                        let animalDist = dist(standX, standY, standZ, animalX, animalY, animalZ);
                        if (animalDist < 5) {
                            if (animal.getPitch() > 0.1) { 
                                animalDistArr.push(animalDist);
                                animalNameArr.push(animal.getName());
                                animalPitchArr.push(animal.getPitch());
                            }
                        }
                    })
                    for (let i = 0; i < animalNameArr.length; i++) {  // Assigns whichever animal was the closest to the stand to the name of the stand
                        if (stand.getName().replace(/'.*/,'') != Player.getName()) { // Checks to make sure its not the main player
                            if (animalDistArr.length == 1) {
                                pName.push(stand.getName().replace(/'.*/,''))
                                standUUID.push(stand.getUUID());
                                playerAnimal.push(animalNameArr[0]);
                            }
                            else {
                                let lowDistIndex = animalDistArr.indexOf(Math.min(...animalDistArr)); // Finds the lowest value index
                                pName.push(stand.getName().replace(/'.*/,''));
                                standUUID.push(stand.getUUID());
                                playerAnimal.push(animalNameArr[lowDistIndex]);
                            }
                        }
                    }
                }
            })

            let scoreboardLines = Scoreboard.getLines();
            for (let i = 0; i < scoreboardLines.length; i++) {
                let scoreboardLine = ChatLib.removeFormatting(scoreboardLines[i]).toLowerCase();
                if (scoreboardLine.includes("starting")) {
                    username = [];
                    userAnimal = [];
                }
                if (!username.includes(Player.getName())) {
                    if (scoreboardLine.includes("pig")) {
                        username.push(Player.getName());
                        userAnimal.push("Pig");
                    } else if (scoreboardLine.includes("cow")) {
                        username.push(Player.getName());
                        userAnimal.push("Cow");
                    } else if (scoreboardLine.includes("chic🍭ken")) {
                        username.push(Player.getName());
                        userAnimal.push("Chicken");
                    } else if (scoreboardLine.includes("shee🍭p")) {
                        username.push(Player.getName());
                        userAnimal.push("Sheep");
                    } else if (scoreboardLine.includes("wolf")) {
                        username.push(Player.getName());
                        userAnimal.push("Wolf");
                    } else if (scoreboardLine.includes("ocel🍭ot")) {
                        username.push(Player.getName());
                        userAnimal.push("Ocelot");
                    } else if (scoreboardLine.includes("hors🍭e")) {
                        username.push(Player.getName());
                        userAnimal.push("horse");
                    }
                } else {
                    if (scoreboardLine.includes("pig")) {
                        userAnimal[0] = "Pig";
                    } else if (scoreboardLine.includes("cow")) {
                        userAnimal[0] = "Cow";
                    } else if (scoreboardLine.includes("chic🍭ken")) {
                        userAnimal[0] = "Chicken";
                    } else if (scoreboardLine.includes("shee🍭p")) {
                        userAnimal[0] = "Sheep";
                    } else if (scoreboardLine.includes("wolf")) {
                        userAnimal[0] = "Wolf";
                    } else if (scoreboardLine.includes("ocel🍭ot")) {
                        userAnimal[0] = "Ocelot";
                    } else if (scoreboardLine.includes("hors🍭e")) {
                        userAnimal[0] = "Horse";
                    }
                }
            }

            for (let i = pName.length-1; i >= 0; i--) {
                if (!username.includes(pName[i])) {
                    username.push(pName[i]);
                    userAnimal.push(playerAnimal[i]);

                } else {
                    userIndex = username.indexOf(pName[i]);
                    userAnimal[userIndex] = playerAnimal[i];
                }
            }
            pName = [];
            playerAnimal = [];


            let poops = World.getAllEntitiesOfType(EntityItem);
            poops.forEach((poop) => {
                if (poop.getName() == "item.item.dyePowder.brown") {
                    let itemstack = poop.getEntity().func_92059_d();
                    let nbtreal = new Item(itemstack).getNBT();
                    let name  = nbtreal.getCompoundTag("tag").getCompoundTag("display").getTag("Name").toString();
                    let nameEdit = name.substring(1,name.length-1);
                    if (username.includes(nameEdit)) {
                        let userIndex = username.indexOf(nameEdit);
                        let animalPoop = userAnimal[userIndex];
                        const NBTTagString = Java.type('net.minecraft.nbt.NBTTagString');
                        let entity = poop.getEntity().func_92059_d().func_77978_p();
                        entity.func_74775_l("display").func_74782_a('Name', new NBTTagString(animalPoop.toLowerCase()));
                    }
                }
            })

            let inventory = Player.getInventory().getItems();
            for (let i = 0; i < inventory.length; i++) {
                if (inventory[i] != null) {
                    if (inventory[i].getRegistryName() == "minecraft:dye") {
                        let lore = inventory[i].getLore().join().removeFormatting();
                        let tempArr = lore.split(/'/);
                        let name = tempArr[0];
                        if (username.includes(name)) {
                            let userIndex = username.indexOf(name);
                            let animalPoop = userAnimal[userIndex];
                            const NBTTagString = Java.type('net.minecraft.nbt.NBTTagString');
                            let tag = inventory[i].getItemStack().func_77978_p();
                            tag.func_74775_l('display').func_74782_a('Name', new NBTTagString(animalPoop.toLowerCase()));
                        }
                    }
                }
            }
        } catch(e) {
            ChatLib.chat(e);
        }
    }
}

function dist(x1, y1, z1, x2, y2, z2) {
    return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2)+Math.pow(z2-z1,2));
}