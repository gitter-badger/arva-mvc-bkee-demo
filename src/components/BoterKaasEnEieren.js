/**
 * Created by mysim1 on 16/02/15.
 */

class Speler {
    constructor(speler) {
        this.naam = speler;
        this.zetten = [];
        console.log(this.naam);
    }
}


export class BoterKaasEnEieren {

    constructor() {
        this._move = 0;
        this._speler1 = new Speler('onbekend 1');
        this._speler2 = new Speler('onbekend 2');
    }


    //some
    addPlayer1(playerName ) {
        this._speler1 = new Speler(playerName);
    }

    addPlayer2(playerName ) {
        this._speler2 = new Speler(playerName);
    }

    zet(plek) {
        // bepaal wie aan zet is en markeer de keuze voor deze speler

        // dit is de zoveelste zet
        this._move++;

        var wieIs = this._move % 2;
        if (wieIs == 1) {
            this._speler1.zetten.push(plek);
            console.log(this._speler1.naam + ' heeft gespeeld');
        }
        else if (wieIs == 0) {
            this._speler2.zetten.push(plek);
            console.log(this._speler2.naam + ' heeft gespeeld');
        }

        // heeft er iemand al gewonnen? de spelregels
    }
}

