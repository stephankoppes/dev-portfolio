import { createClient, type ClientConfig } from "@sanity/client";
import ImageUrlBuilder from "@sanity/image-url";

const config: ClientConfig = {
    projectId: 'ldkvbgk6',
    dataset: 'production',
    useCdn: true,
    apiVersion: '2025-08-05'
}

const sanityClient = createClient(config);
export default sanityClient;

export function processProjectEntries(rawProjects: SanityProject) {
    const builder = ImageUrlBuilder(sanityClient);
    const projectImageUrl = builder.image(rawProjects.image).url();

    const processedProject: ProcessedProject = {
        name: rawProjects.name,
        company: rawProjects.company,
        dateAccomplished: rawProjects.dateAccomplished,
        stack: rawProjects.stack,
        slug: rawProjects.slug,
        projectImageUrl,
        content: rawProjects.content.map(processedProjectContent)
    }

    return processedProject;
}

function processedProjectContent(content: RawTextContent | RawImageContent) {
    if (content._type === "block") {
        // process text content
        const processedTextContent: ProcessedTextContent = {
            type: 'text',
            style: content.style,
            textToRender: content.children.map((elem) => elem.text).join("\n"),
        }
        return processedTextContent;
    } else {
        // process image content
        const builder = ImageUrlBuilder(sanityClient);
        const projectImageUrl = builder.image(content).url();

        const processedImage: ProcessedImageContent = {
            type: "image",
            url: projectImageUrl,
        }

        return processedImage;
    }
}