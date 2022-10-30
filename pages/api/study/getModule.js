import _ from 'lodash';
const fs = require('fs');

export default async function handler(req, res) {
    const { module } = req.body;

    var data = fs.readFileSync(`./data/${module.fields.unit.fields.course.fields.slug}/${module.fields.unit.fields.unitNumber}-${module.fields.moduleNumber}.json`, 'utf8');

    res.status(200).json(JSON.parse(data));
}
