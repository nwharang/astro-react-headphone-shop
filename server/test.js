import prisma from "./utils/connectDB.js";
import DiagioiVN from './DiagioiVN.json' assert { type: 'json' }
async function createDB() {
    await City.forEach(async (City) => {
        await City.Districts.forEach(async (District) => {
            console.log(District.Name);
            await District.Wards.forEach(async (Ward) => {
                await Ward.Level.forEach(async (Level) => {
                    await prisma.Level.createMany({
                        data: {
                            id: Level.Id,
                            name: Level.Name,
                        },
                    })
                })
                await prisma.Ward.createMany({
                    data: {
                        id: Ward.Id,
                        name: Ward.Name,
                        Level: {
                            connect: Ward.Level.map(Level => { return { id: Level.Id } })
                        }
                    },
                    include: {
                        Level: true
                    }
                })
            })
            await prisma.Districts.createMany({
                data: {
                    id: District.Id,
                    name: District.Name,
                    Wards: {
                        connect: District.Wards.map(Ward => { return { id: Ward.Id } })
                    }
                },
                include: {
                    Wards: true
                }
            })
        })
        await prisma.City.createMany({
            data: {
                id: City.Id,
                name: City.Name,
                Districts: {
                    connect: city.Districts.map(District => { return { id: District.Id } })
                }
            },
            include: {
                Districts: true
            }
        })
    })
}
await createDB()