import db from "./db.js"; 

async function testconnection() {
    try {
        const result = await db.raw('SELECT NOW()');   
        console.log('Ket noi thanh cong!');
        console.log('Thoi gian server: ', result.rows[0].now);

        await db.destroy();
    } catch (error) {
        console.error('Ket noi that bai!', error.message);
        process.exit(1);
    }
}

testconnection();