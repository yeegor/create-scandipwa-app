import { selectDirectoryWithHistory } from '../util/cwd';

export const SOURCE_MODULE = 'sourceModule';
export const TARGET_MODULE = 'targetModule';

const SOURCE_MODULE_DESCRIPTION = 'source';
const TARGET_MODULE_DESCRIPTION = 'target';

const getModule = async (
    description: string, 
    moduleKey: string,
    isSkippable?: boolean
): Promise<string|undefined> => {
    const modulePath = await selectDirectoryWithHistory(
        `Select ${description} module`,
        moduleKey,
        isSkippable
    );

    if (!modulePath && !isSkippable) {
        throw new Error(`A ${description} module must have been selected!`);
    }

    return modulePath as string | undefined;
}

export const getTargetModule = (isSkippable?: boolean) => getModule(
    TARGET_MODULE_DESCRIPTION, 
    TARGET_MODULE, 
    isSkippable
);

export const getSourceModule = (isSkippable?: boolean) => getModule(
    SOURCE_MODULE_DESCRIPTION, 
    SOURCE_MODULE, 
    isSkippable
);