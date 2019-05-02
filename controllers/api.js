const APIError = require('../rest').APIError;
const path = require('path');
const fs = require('mz/fs');
const saved_dir = path.normalize(__dirname + path.sep + '..' + path.sep + 'datasource');


module.exports = {
    'GET /api/doctors': async (ctx, next) => {
        var s, fp = path.join(saved_dir, 'doctors.json');
        // console.log(`load from file ${fp}...`);
        var doctors = await fs.readFile(fp, 'utf8');
        var s, fp = path.join(saved_dir, 'attributes.json');
        var attributes = await fs.readFile(fp, 'utf8');
        var attributes = JSON.parse(attributes);
        ctx.rest({
            doctors: JSON.parse(doctors),
            specialties: attributes.specialties,
            areas: attributes.areas,
            maxScore: attributes.maxScore
        });
    },
    'GET /api/description/:id': async (ctx, next) => {
        var s, fp = path.join(saved_dir, 'doctors.json');
        var doctors = await fs.readFile(fp, 'utf8');
        var doctors = JSON.parse(doctors);
        var i, index = -1;
        for (i=0; i<doctors.length; i++) {
            if (doctors[i].id === ctx.params.id) {
                index = i;
                break;
            }
        }
        if (index === -1) {
            throw new APIError('notfound', 'Doctor not found by id: ' + ctx.params.id);
        }
        
        ctx.rest({
            description: doctors[index].description
        });
    }

}
