import { SomeCompanyIdentifier } from "../identifiers/some-company-identifier";
import { InterpreterProxy } from "./interpreter-proxy";
import { SomeCompanyInterpreter } from "./some-company-interpreter";

export const createDefaultInterpreterProxy = () => {
    const registeredIdentifiers = [
        new SomeCompanyIdentifier()
    ];

    const registeredInterpreters = {
        "Some-Company-Duplicate": new SomeCompanyInterpreter()
    }

    const interpreterProxy = new InterpreterProxy(
        registeredIdentifiers,
        registeredInterpreters
    )

    return interpreterProxy;
}
