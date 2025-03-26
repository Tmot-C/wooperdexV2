WooperdexV2 is an development on my half-way miniproject (conceptually anyway) with more functionality to come (maybe again).

The app uses a Java Springboot backend mostly for CRUD operations, and an Angular Frontend where most of the logic is. Angular Material UI was used to style the project, but as a consequence of abandoning the Bootstrap integrated grid system, the app is not mobile-friendly this time around due to shall we say growing pains with learning Material UI. MySQL is used a store for users, but the vast majority of data is house within MongoDB due to the non-standard Pokemon data.

WooperdexV2 is the logical leap forward from my initial concept and is largely inspired by the Pokemon Showdown teabuilder to a greater extent. While it no longer has fluff pokemon data like Pokedex descriptions, competitively important info like tiers, in-depth move descriptions and held item ratings.

All 1025 Pokemon (now including extra forms and regional variants!) are viewable in the dex. The pokedex is sorted via tiers, and by default LC, NFE and Illegal Pokemon (as defined by the rules in the latest National Dex Competitive format) are lower down on the list, but are still searchable and viewable. The dex is meant to be navigated via buttons exclusively, although there is some freedom in choosing which aspects of the Pokemon you want to build first. Users can save (at least thats the intention) up to 6 teams of 6 pokemon to their liking, and can freely adjust their moves, stat EVs/IVs and abilities to their liking.

Disclaimer: Due to time constraints and personal gaps in knowledge, logic for the components are not fully functional as planned (currently users cannot manually edit their pokemon they have to be removed and added anew) due to inexperience with route planning and component logic. WooperdexV2 also exclusively uses firebase google authentication, and as of the time of writing API endpoints are also unsecured, although no sensitive info is stored within the database unless firebase IDs could be considered as sensitive.


Credits:
https://www.smogon.com/ (Sprites and data)

https://github.com/smogon/pokemon-showdown (Data and original inspiration)

https://bulbapedia.bulbagarden.net/wiki/ (Images)

https://wallpapercave.com/w/wp2525596 (Wooper background image)

GameFreak and Nintendo