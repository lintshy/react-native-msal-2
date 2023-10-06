const MOCK_DC_LOC = require('./__data__/locations')
const MOCK_USER = require('./__data__/User')


module.exports = () => {
    const data = {
        Locations: MOCK_DC_LOC,
        Users: MOCK_USER,
        LocationAccuracies: [],
        PickingAccuracies: [],
        PackingQualities: [],
        StagingAccuracies: [],
        FleetRoutings: [],
        LhFleetLoadings: [],
        FleetDeliveries: []
    }

    return data
}