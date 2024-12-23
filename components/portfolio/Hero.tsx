//
//import { HeroProps } from "./types";
//import { Input } from "@/components/ui/input";
//import { Textarea } from "@/components/ui/textarea";
//import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
//
//const defaultProps: HeroProps = {
//  title: "Welcome to My Portfolio",
//  subtitle: "I'm a passionate creator building amazing digital experiences. Explore my work and let's create something amazing together.",
//  backgroundType: "image",
//  backgroundUrl: "https://images.unsplash.com/photo-1579547621869-0ddb5f237392?auto=format&fit=crop&q=80"
//};
//
//export function Hero({ 
//  title = defaultProps.title,
//  subtitle = defaultProps.subtitle,
//  backgroundType = defaultProps.backgroundType,
//  backgroundUrl = defaultProps.backgroundUrl,
//  onChange
//}: Partial<HeroProps> & { onChange?: (props: HeroProps) => void }) {
//  return (
//    <div className="space-y-8 bg-background p-8 rounded-lg">
//      <div className="space-y-2">
//        <label className="text-sm font-medium">Title</label>
//        <Input
//          value={title}
//          onChange={(e) => onChange?.({ title: e.target.value, subtitle, backgroundType, backgroundUrl })}
//          className="text-3xl font-bold"
//        />
//      </div>
//
//      <div className="space-y-2">
//        <label className="text-sm font-medium">Subtitle</label>
//        <Textarea
//          value={subtitle}
//          onChange={(e) => onChange?.({ title, subtitle: e.target.value, backgroundType, backgroundUrl })}
//          className="text-xl"
//          rows={3}
//        />
//      </div>
//
//      <div className="grid grid-cols-2 gap-4">
//        <div className="space-y-2">
//          <label className="text-sm font-medium">Background Type</label>
//          <Select
//            value={backgroundType}
//            onValueChange={(value: 'image' | 'video') => 
//              onChange?.({ title, subtitle, backgroundType: value, backgroundUrl })}
//          >
//            <SelectTrigger>
//              <SelectValue />
//            </SelectTrigger>
//            <SelectContent>
//              <SelectItem value="image">Image</SelectItem>
//              <SelectItem value="video">Video</SelectItem>
//            </SelectContent>
//          </Select>
//        </div>
//
//        <div className="space-y-2">
//          <label className="text-sm font-medium">
//            {backgroundType === 'image' ? 'Image' : 'Video'} URL
//          </label>
//          <Input
//            value={backgroundUrl}
//            onChange={(e) => onChange?.({ title, subtitle, backgroundType, backgroundUrl: e.target.value })}
//            placeholder={`Enter ${backgroundType} URL`}
//          />
//        </div>
//      </div>
//    </div>
//  );
//}
