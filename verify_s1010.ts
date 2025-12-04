import { EVENT_SCHEMAS } from './services/eventLibrary';
import { EventType } from './eventType';

const s1010 = EVENT_SCHEMAS[EventType.S1010];

console.log('S1010 ID:', s1010.id);
console.log('S1010 Title:', s1010.title);
console.log('Default State Keys:', Object.keys(s1010.defaultState));
console.log('ideEvento Keys:', Object.keys(s1010.defaultState.ideEvento));
console.log('ideEmpregador Keys:', Object.keys(s1010.defaultState.ideEmpregador));
console.log('infoRubrica Keys:', Object.keys(s1010.defaultState.infoRubrica));

const inclusao = s1010.defaultState.infoRubrica.inclusao;
console.log('inclusao Keys:', Object.keys(inclusao));

const ideRubrica = inclusao.ideRubrica;
console.log('ideRubrica Keys:', Object.keys(ideRubrica));

const dadosRubrica = inclusao.dadosRubrica;
console.log('dadosRubrica Keys:', Object.keys(dadosRubrica));

// Check for new required fields
if ('ideTabRubr' in ideRubrica && 'natRubr' in dadosRubrica) {
    console.log('SUCCESS: ideTabRubr and natRubr exist');
} else {
    console.error('ERROR: Missing ideTabRubr or natRubr');
}

// Check for process arrays
const processArrays = ['ideProcessoCP', 'ideProcessoIRRF', 'ideProcessoFGTS', 'ideProcessoPisPasep'];
let allArraysExist = true;
for (const arr of processArrays) {
    if (arr in dadosRubrica && Array.isArray(dadosRubrica[arr])) {
        console.log(`SUCCESS: ${arr} is an array`);
    } else {
        console.error(`ERROR: ${arr} missing or not an array`);
        allArraysExist = false;
    }
}

if (allArraysExist) {
    console.log('SUCCESS: All process arrays exist');
}
