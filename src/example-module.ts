import { BotModule } from "@akaiv/core";

/*
 * Created on Sat Oct 26 2019
 *
 * Copyright (c) storycraft. Licensed under the MIT Licence.
 */

export class ExampleModule extends BotModule {

    constructor({ something }: { // ALways receive params as object
        something: string
    }) {
        super();
    }

    get Name() {
        return 'Example'; // Module name
    }

    get Description() {
        return 'This is example module';
    }

    get Namespace() {
        return 'ex'; //This is used as command prefix `ex/{command}` and module id
    }

}