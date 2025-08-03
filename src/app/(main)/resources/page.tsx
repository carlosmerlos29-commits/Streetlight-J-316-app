import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Video, BookOpen, Download } from 'lucide-react';

const resources = [
  { title: "Gospel Tract Pack", description: "A collection of printable gospel tracts for various audiences.", icon: FileText, type: 'PDF' },
  { title: "Evangelism 101", description: "A video series covering the basics of effective evangelism.", icon: Video, type: 'Video' },
  { title: "Street Preaching Guide", description: "An in-depth guide on the art of open-air preaching.", icon: BookOpen, type: 'Guide' },
  { title: "The Bridge Illustration", description: "Visual aid for explaining the gospel message clearly.", icon: FileText, type: 'PDF' },
  { title: "Follow-up Strategies", description: "Learn how to disciple new believers effectively.", icon: BookOpen, type: 'Guide' },
  { title: "Testimony Sharing Workshop", description: "A video workshop on how to craft and share your personal testimony.", icon: Video, type: 'Video' },
];

export default function ResourcesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Resource Library</h1>
        <p className="text-muted-foreground">Downloadable tools and guides to aid your ministry.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4">
                <resource.icon className="h-8 w-8 text-primary" />
                <div>
                    <CardTitle>{resource.title}</CardTitle>
                    <CardDescription>{resource.type}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{resource.description}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
