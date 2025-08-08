
import { FileText, Video, BookOpen, LucideIcon } from 'lucide-react';
import type { ReactElement } from 'react';

export interface Resource {
    slug: string;
    title: string;
    pageTitle: string;
    description: string;
    icon: LucideIcon;
    type: 'PDF' | 'Video' | 'Guide';
    content: string;
}

export const resources: Resource[] = [
    { 
        slug: 'gospel-tract-pack',
        title: 'Paquete de Folletos del Evangelio',
        pageTitle: 'Folletos del Evangelio Descargables',
        description: 'Una colección de folletos del evangelio imprimibles para diversas audiencias.', 
        icon: FileText, 
        type: 'PDF',
        content: `Este paquete contiene una variedad de folletos del Evangelio diseñados profesionalmente que están listos para imprimir y distribuir. Cada folleto está diseñado para ser visualmente atractivo y teológicamente sólido, cubriendo diferentes temas y preguntas que las personas puedan tener sobre el cristianismo.`
    },
    { 
        slug: 'evangelism-101',
        title: 'Evangelismo 101', 
        pageTitle: 'Serie de Videos de Evangelismo 101',
        description: 'Una serie de videos que cubre los conceptos básicos del evangelismo efectivo.', 
        icon: Video, 
        type: 'Video',
        content: `Ya sea que seas nuevo en compartir tu fe o busques un repaso, esta serie de videos proporciona capacitación práctica y con base bíblica. El pastor Juan Pérez te guía a través de los elementos esenciales del evangelismo en el siglo XXI.`
    },
    { 
        slug: 'street-preaching-guide',
        title: 'Guía de Predicación Callejera', 
        pageTitle: 'Una Guía Práctica para la Predicación Callejera',
        description: 'Una guía detallada sobre el arte de la predicación al aire libre.', 
        icon: BookOpen, 
        type: 'Guide',
        content: `La predicación al aire libre tiene una larga y rica historia en la fe cristiana. Desde los profetas del Antiguo Testamento hasta los apóstoles en el libro de los Hechos, la proclamación pública ha sido un medio principal para difundir el Evangelio. Esta guía está diseñada para equiparte con la sabiduría práctica y el fundamento teológico necesarios para predicar eficazmente en la plaza pública.`
    },
    { 
        slug: 'bridge-illustration',
        title: 'La Ilustración del Puente', 
        pageTitle: 'La Ilustración del Puente a la Vida',
        description: 'Ayuda visual para explicar el mensaje del evangelio con claridad.', 
        icon: FileText, 
        type: 'PDF',
        content: `La Ilustración del Puente es una herramienta visual clásica, poderosa y simple para explicar el Evangelio. Ayuda a las personas a comprender la separación causada por el pecado y cómo Jesucristo es el único camino para cerrar esa brecha y restaurar nuestra relación con Dios.`
    },
    { 
        slug: 'follow-up-strategies',
        title: 'Estrategias de Seguimiento', 
        pageTitle: 'Seguimiento y Discipulado Efectivos',
        description: 'Aprende a discipular a los nuevos creyentes de manera efectiva.', 
        icon: BookOpen, 
        type: 'Guide',
        content: `El evangelismo no termina cuando alguien profesa fe en Cristo; comienza un nuevo capítulo llamado discipulado. La Gran Comisión (Mateo 28:18-20) no se trata solo de hacer conversos, sino de hacer discípulos. El seguimiento efectivo es crucial para ayudar a los nuevos creyentes a arraigarse en su fe y conectarse con la iglesia local.`
    },
    { 
        slug: 'testimony-workshop',
        title: 'Taller para Compartir Testimonios', 
        pageTitle: 'Taller: Compartiendo Tu Testimonio Personal',
        description: 'Un taller en video sobre cómo elaborar y compartir tu testimonio personal.', 
        icon: Video, 
        type: 'Video',
        content: `Tu testimonio personal es una de las herramientas evangelísticas más poderosas que tienes. Este taller en video te guía a través del proceso de estructurar tu historia de una manera clara, concisa y centrada en Cristo.`
    },
];
