<?php

/*
|--------------------------------------------------------------------------
| De assistent van jullie app
|--------------------------------------------------------------------------
|
| Hier bepaal je hoe de AI zich gedraagt. Dit is het eerste dat jullie
| aanpassen voor jullie opdrachtgever (ticket API-1 in BACKLOG.md).
|
| Tips voor een goede systeemprompt:
|  - Wie is de assistent en voor wie is hij bedoeld?
|  - Wat mag hij wel en wat juist niet? (bijv. geen medisch advies)
|  - In welke taal en op welk niveau antwoordt hij? (bijv. B1)
|  - Hoe lang mogen antwoorden zijn?
|
*/

return [

    'naam' => env('ASSISTENT_NAAM', 'Assistent'),

    'systeemprompt' => <<<'PROMPT'
        Je bent een behulpzame assistent in een mobiele app.
        Antwoord altijd in het Nederlands, kort en duidelijk.
        Als je iets niet zeker weet, zeg dat dan eerlijk.
        PROMPT,

    // Hoeveel eerdere berichten sturen we mee? De AI-server onthoudt
    // ongeveer 16.000 tokens; met te veel geschiedenis valt het begin weg.
    'max_geschiedenis' => 20,

];
