const {
    Configuration,
    HiveConnection,
    IDLContainer,
} = require('jshs2');

const options = {
    auth: 'NOSASL',
    host: '0.0.0.0',
    port: 1527,
};

const hiveConfig = new Configuration(options);
const idl = new IDLContainer();

async function main() {
    console.log('main');
    await idl.initialize(hiveConfig);
    const connection = await new HiveConnection(hiveConfig, idl);
    const cursor = await connection.connect();
    // const res = await cursor.execute('SELECT * FROM orders LIMIT 10');
    const res = await cursor.execute('SELECT * FROM test.emp');

    if (res.hasResultSet) {
        const fetchResult = await cursor.fetchBlock();
        fetchResult.rows.forEach((row) => {
            console.log(row);
        });
    }

    console.log('close');
    cursor.close();
    connection.close();
}

main().then(() => {
    console.log('Finished.');
});