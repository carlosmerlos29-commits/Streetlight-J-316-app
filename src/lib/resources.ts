
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
        title: 'Gospel Tract Pack',
        pageTitle: 'Downloadable Gospel Tracts',
        description: 'A collection of printable gospel tracts for various audiences.', 
        icon: FileText, 
        type: 'PDF',
        content: `This package contains a variety of professionally designed Gospel tracts that are ready for you to print and distribute. Each tract is designed to be visually engaging and theologically sound, covering different topics and questions people may have about Christianity.`
    },
    { 
        slug: 'evangelism-101',
        title: 'Evangelism 101', 
        pageTitle: 'Evangelism 101 Video Series',
        description: 'A video series covering the basics of effective evangelism.', 
        icon: Video, 
        type: 'Video',
        content: `Whether you're new to sharing your faith or looking for a refresher, this video series provides practical, biblically-grounded training. Pastor John Doe walks you through the essential elements of 21st-century evangelism.`
    },
    { 
        slug: 'street-preaching-guide',
        title: 'Street Preaching Guide', 
        pageTitle: 'A Practical Guide to Street Preaching',
        description: 'An in-depth guide to the art of open-air preaching.', 
        icon: BookOpen, 
        type: 'Guide',
        content: `Open-air preaching has a long and rich history in the Christian faith. From the Old Testament prophets to the apostles in the book of Acts, public proclamation has been a primary means of spreading the Gospel. This guide is designed to equip you with the practical wisdom and theological foundation needed to preach effectively in the public square.`
    },
    { 
        slug: 'bridge-illustration',
        title: 'The Bridge Illustration', 
        pageTitle: 'The Bridge to Life Illustration',
        description: 'A visual aid for explaining the gospel message with clarity.', 
        icon: FileText, 
        type: 'PDF',
        content: `The Bridge Illustration is a classic, powerful, and simple visual tool for explaining the Gospel. It helps people understand the separation caused by sin and how Jesus Christ is the only way to bridge that gap and restore our relationship with God.`
    },
    { 
        slug: 'follow-up-strategies',
        title: 'Follow-up Strategies', 
        pageTitle: 'Effective Follow-Up and Discipleship',
        description: 'Learn how to effectively disciple new believers.', 
        icon: BookOpen, 
        type: 'Guide',
        content: `Evangelism doesn't end when someone professes faith in Christ; it begins a new chapter called discipleship. The Great Commission (Matthew 28:18-20) is not just about making converts, but about making disciples. Effective follow-up is crucial in helping new believers get rooted in their faith and connected to the local church.`
    },
    { 
        slug: 'testimony-workshop',
        title: 'Testimony Sharing Workshop', 
        pageTitle: 'Workshop: Sharing Your Personal Testimony',
        description: 'A video workshop on how to craft and share your personal testimony.', 
        icon: Video, 
        type: 'Video',
        content: `Your personal testimony is one of the most powerful evangelistic tools you have. This video workshop walks you through the process of structuring your story in a way that is clear, concise, and Christ-centered.`
    },
];
