import { JsonParser } from "jackson-js";
import { BggParseError } from "../../../errors";
import { IDtoParser } from "../interface";

export abstract class BaseDtoParser<T> implements IDtoParser<T> {
    parser: JsonParser<T>;

    constructor(private dtoName: string) {
        this.parser = new JsonParser<T>();
        this.parser.defaultContext.features!.deserialization.FAIL_ON_UNKNOWN_PROPERTIES = false;
    }

    protected abstract extractData(jsonData: any): any;
    protected abstract getDtoClass(): any;

    protected postProcess(items: T[]): T[] {
        return items;
    }

    jsonToDto(jsonData: any): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {
            try {
                const data = this.extractData(jsonData);
                if (data === null || data === undefined) {
                    resolve([]);
                    return;
                }
                const result = this.parser.transform(data, {
                    mainCreator: () => [Array, [this.getDtoClass()]]
                });
                resolve(this.postProcess(result));
            } catch (error) {
                reject(
                    new BggParseError(
                        `Failed to parse ${this.dtoName} DTO: ${error instanceof Error ? error.message : String(error)}`
                    )
                );
            }
        });
    }
}
