const hive = require('hive-driver');
const { TCLIService, TCLIService_types } = hive.thrift;
const client = new hive.HiveClient(
    TCLIService,
    TCLIService_types
);
const utils = new hive.HiveUtils(
    TCLIService_types
);

client.connect(
    {
        // host: '0.0.0.0',
        // host: 'hdfs://localhost:9000/user/hive/warehouse/test.db',
        host: '0.0.0.0',
        port: 1527
    },
    new hive.connections.TcpConnection(),
    // new hive.auth.NoSaslAuthentication()
    // new hive.auth.PlainTcpAuthentication({
    //   username: 'localhost',
    //   password: '',
    // })
).then(async client => {
    console.log('client');
    const session = await client.openSession({
        client_protocol: TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V10
    });

    console.log('start operation');
    const selectDataOperation = await session.executeStatement(
        'select * from test.emp', { runAsync: true }
    );
    await utils.waitUntilReady(selectDataOperation, false, () => {});
    await utils.fetchAll(selectDataOperation);
    console.log('close');

    await selectDataOperation.close();
    await session.close();
});