
import { FileText, Video, BookOpen, LucideIcon } from 'lucide-react';
import { ReactElement } from 'react';

export interface Resource {
    slug: string;
    title: string;
    pageTitle: string;
    description: string;
    icon: LucideIcon;
    type: 'PDF' | 'Video' | 'Guide';
    content: ReactElement;
}

export const resources: Resource[] = [
    { 
        slug: 'gospel-tract-pack',
        title: 'Gospel Tract Pack',
        pageTitle: 'Downloadable Gospel Tracts',
        description: 'A collection of printable gospel tracts for various audiences.', 
        icon: FileText, 
        type: 'PDF',
        content: (
            <>
                <h3>About This Resource</h3>
                <p>This pack contains a variety of professionally designed Gospel tracts that are ready to print and distribute. Each tract is crafted to be visually engaging and theologically sound, covering different topics and questions people may have about Christianity.</p>
                <h4>Included Tracts:</h4>
                <ul>
                    <li><strong>The Good Person Test:</strong> A classic tract that challenges the reader&apos;s perception of their own righteousness.</li>
                    <li><strong>Are You a Good Person?:</strong> An illustrated version perfect for visual learners.</li>
                    <li><strong>The &quot;Meaning of Life&quot; Tract:</strong> Addresses existential questions and points to Christ as the answer.</li>
                    <li><strong>Atheist Testimonial Tract:</strong> Shares a powerful story of a former atheist&apos;s journey to faith.</li>
                </ul>
            </>
        )
    },
    { 
        slug: 'evangelism-101',
        title: 'Evangelism 101', 
        pageTitle: 'Evangelism 101 Video Series',
        description: 'A video series covering the basics of effective evangelism.', 
        icon: Video, 
        type: 'Video',
        content: (
             <>
                <h3>About This Series</h3>
                <p>Whether you&apos;re new to sharing your faith or looking for a refresher, this video series provides practical, biblically-grounded training. Pastor John Doe walks you through the essential elements of evangelism in the 21st century.</p>
                <h4>Video Lessons:</h4>
                <ol>
                    <li><strong>Overcoming Fear:</strong> Practical tips for building confidence and overcoming the fear of rejection.</li>
                    <li><strong>Starting Conversations:</strong> How to naturally transition everyday conversations to spiritual topics.</li>
                    <li><strong>Sharing Your Testimony:</strong> Learn to craft your personal story of faith in a compelling and concise way.</li>
                    <li><strong>Answering Common Objections:</strong> Gentle and respectful ways to respond to frequently asked questions and objections.</li>
                </ol>
            </>
        )
    },
    { 
        slug: 'street-preaching-guide',
        title: 'Street Preaching Guide', 
        pageTitle: 'A Practical Guide to Street Preaching',
        description: 'An in-depth guide on the art of open-air preaching.', 
        icon: BookOpen, 
        type: 'Guide',
        content: (
            <>
                <h2>Introduction: The Call to Proclaim</h2>
                <p>Open-air preaching has a long and storied history in the Christian faith. From the prophets of the Old Testament to the apostles in the book of Acts, public proclamation has been a primary means of spreading the Gospel. This guide is designed to equip you with the practical wisdom and theological grounding needed to preach effectively in the public square.</p>
                
                <h3>Section 1: The Heart of the Preacher</h3>
                <p>Before you ever open your mouth, the condition of your heart is paramount. Effective street preaching flows from a place of deep love for God and genuine compassion for the lost. It is not about winning arguments or drawing a crowd, but about faithfully heralding the good news of Jesus Christ.</p>
                <ul>
                    <li>Humility: Recognize that you are a fellow sinner saved by grace.</li>
                    <li>Love: Let love for your listeners be your primary motivation.</li>
                    <li>Prayer: Bathe your efforts in prayer, depending on the Holy Spirit for power and wisdom.</li>
                </ul>

                <h3>Section 2: Crafting Your Message</h3>
                <p>Your message should be clear, concise, and centered on the Gospel. Avoid getting sidetracked by secondary issues. The core message is the &quot;kerygma&quot; - the proclamation of Christ&apos;s death and resurrection for sinners.</p>
                <ol>
                    <li><strong>The Law:</strong> Use the law of God (the Ten Commandments) to show people their need for a savior. This helps to reveal sin for what it is.</li>
                    <li><strong>Grace:</strong> Proclaim the good news of God&apos;s grace in Jesus. He lived the perfect life we couldn&apos;t, died the death we deserved, and rose again, conquering sin and death.</li>
                    <li><strong>The Call to Repentance and Faith:</strong> Urge your listeners to turn from their sin (repent) and trust in Jesus Christ alone for their salvation (faith).</li>
                </ol>

                <h3>Section 3: Practical Considerations</h3>
                <p>Choosing a location, understanding local laws, and handling hecklers are all part of the practical side of street ministry.</p>
                <ul>
                    <li><strong>Location:</strong> Look for areas with high foot traffic, such as town squares, university campuses, or public parks.</li>
                    <li><strong>Legalities:</strong> Research local ordinances regarding public speaking and sound amplification to ensure you are operating within the law.</li>
                    <li><strong>Handling Interaction:</strong> Welcome questions and dialogue. Respond to hecklers with grace and patience, never returning anger for anger. Remember the command in 1 Peter 3:15 to make a defense with &quot;gentleness and respect.&quot;</li>
                </ul>
            </>
        )
    },
    { 
        slug: 'bridge-illustration',
        title: 'The Bridge Illustration', 
        pageTitle: 'The Bridge to Life Illustration',
        description: 'Visual aid for explaining the gospel message clearly.', 
        icon: FileText, 
        type: 'PDF',
        content: (
             <>
                <h3>About This Resource</h3>
                <p>The Bridge Illustration is a classic, powerful, and simple visual tool for explaining the Gospel. It helps people understand the separation caused by sin and how Jesus Christ is the only way to bridge that gap and restore our relationship with God.</p>
                <h4>How it Works:</h4>
                <p>The illustration visually represents two cliffs: one representing humanity, the other representing God. A great chasm separates them, which is sin. The PDF provides printable diagrams and a step-by-step guide on how to draw and explain the illustration during a conversation.</p>
            </>
        )
    },
    { 
        slug: 'follow-up-strategies',
        title: 'Follow-up Strategies', 
        pageTitle: 'Effective Follow-Up & Discipleship',
        description: 'Learn how to disciple new believers effectively.', 
        icon: BookOpen, 
        type: 'Guide',
        content: (
            <>
              <h2>Introduction: The Great Commission Continues</h2>
              <p>Evangelism doesn&apos;t end when someone professes faith in Christ; it begins a new chapter called discipleship. The Great Commission (Matthew 28:18-20) is not just about making converts, but about making disciples. Effective follow-up is crucial for helping new believers get grounded in their faith and connected to the local church.</p>

              <h3>Section 1: The First 48 Hours</h3>
              <p>The initial hours and days after a person makes a decision for Christ are critical. Your immediate actions can have a lasting impact on their spiritual journey.</p>
              <ul>
                  <li><strong>Get Contact Information:</strong> If appropriate, exchange contact information. A simple text or call can provide immense encouragement.</li>
                  <li><strong>Provide a Bible:</strong> Ensure they have a Bible (or a Bible app). Suggest they start by reading the Gospel of John.</li>
                  <li><strong>Connect to a Church:</strong> The most important step is to invite them to your local church. Give them the service times, address, and offer to meet them there.</li>
              </ul>

              <h3>Section 2: The First Few Weeks</h3>
              <p>Consistency is key in the early stages of a new believer&apos;s walk.</p>
              <ol>
                  <li><strong>Meet One-on-One:</strong> Arrange to meet for coffee or a meal. Use this time to answer their questions and build a relationship.</li>
                  <li><strong>Go Through a Beginners&apos; Study:</strong> Use a simple study guide to cover the basics of the Christian faith: assurance of salvation, the role of the Holy Spirit, prayer, and Bible study.</li>
                  <li><strong>Introduce Them to Other Believers:</strong> Help them integrate into the church community by introducing them to other members, especially those in a similar life stage.</li>
              </ol>

              <h3>Section 3: Long-Term Discipleship</h3>
              <p>The goal of discipleship is to help a person become a mature, self-feeding, and reproducing follower of Jesus.</p>
              <ul>
                  <li><strong>Teach Them to Study the Bible:</strong> Move from just giving them answers to teaching them how to find answers for themselves in Scripture.</li>
                  <li><strong>Encourage Service:</strong> Help them discover their spiritual gifts and find a place to serve within the church.</li>
                  <li><strong>Model Evangelism:</strong> Take them with you as you do evangelism, so they can learn to share their faith with others, thus completing the discipleship cycle.</li>
              </ul>
            </>
        )
    },
    { 
        slug: 'testimony-workshop',
        title: 'Testimony Sharing Workshop', 
        pageTitle: 'Workshop: Sharing Your Personal Testimony',
        description: 'A video workshop on how to craft and share your personal testimony.', 
        icon: Video, 
        type: 'Video',
        content: (
            <>
                <h3>About This Workshop</h3>
                <p>Your personal testimony is one of the most powerful evangelistic tools you have. This video workshop guides you through the process of structuring your story in a way that is clear, concise, and Christ-centered.</p>
                <h4>Workshop Outline:</h4>
                <ol>
                    <li><strong>Part 1: The Three-Point Structure:</strong> Learn how to organize your story around three key points: your life before Christ, how you came to Christ, and your life after Christ.</li>
                    <li><strong>Part 2: Keeping it Concise:</strong> Practical advice for sharing your story in under three minutes, making it suitable for brief conversations.</li>
                    <li><strong>Part 3: Making Christ the Hero:</strong> Learn how to transition from your story to the story of Jesus, ensuring He is the focus.</li>
                </ol>
            </>
        )
    },
];
