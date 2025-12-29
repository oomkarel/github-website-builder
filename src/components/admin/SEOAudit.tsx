import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  TrendingUp,
  FileText,
  Search,
  Link2,
  Image,
  Type
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SEOAuditProps {
  title: string;
  metaTitle: string;
  metaDescription: string;
  content: string; // HTML or plain text content
  focusKeyword?: string;
  language?: 'en' | 'id';
}

interface SEOCheck {
  id: string;
  name: string;
  status: 'pass' | 'warning' | 'fail';
  message: string;
  impact: 'high' | 'medium' | 'low';
  icon: React.ReactNode;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

function extractHeadings(html: string): { h1: string[]; h2: string[]; h3: string[] } {
  const h1Matches = html.match(/<h1[^>]*>(.*?)<\/h1>/gi) || [];
  const h2Matches = html.match(/<h2[^>]*>(.*?)<\/h2>/gi) || [];
  const h3Matches = html.match(/<h3[^>]*>(.*?)<\/h3>/gi) || [];
  
  return {
    h1: h1Matches.map(h => stripHtml(h)),
    h2: h2Matches.map(h => stripHtml(h)),
    h3: h3Matches.map(h => stripHtml(h)),
  };
}

function countInternalLinks(html: string): number {
  const linkMatches = html.match(/<a[^>]*href=["'][^"']*["'][^>]*>/gi) || [];
  return linkMatches.filter(link => 
    !link.includes('http://') && !link.includes('https://') || 
    link.includes('bungkusin.co.id')
  ).length;
}

function countImages(html: string): { total: number; withAlt: number } {
  const imgMatches = html.match(/<img[^>]*>/gi) || [];
  const withAlt = imgMatches.filter(img => /alt=["'][^"']+["']/.test(img)).length;
  return { total: imgMatches.length, withAlt };
}

function calculateKeywordDensity(text: string, keyword: string): number {
  if (!keyword) return 0;
  const words = text.toLowerCase().split(/\s+/);
  const keywordWords = keyword.toLowerCase().split(/\s+/);
  let count = 0;
  
  for (let i = 0; i <= words.length - keywordWords.length; i++) {
    if (words.slice(i, i + keywordWords.length).join(' ') === keywordWords.join(' ')) {
      count++;
    }
  }
  
  return (count / words.length) * 100;
}

export default function SEOAudit({ 
  title, 
  metaTitle, 
  metaDescription, 
  content,
  focusKeyword = '',
  language = 'id'
}: SEOAuditProps) {
  const checks = useMemo<SEOCheck[]>(() => {
    const results: SEOCheck[] = [];
    const plainContent = stripHtml(content);
    const wordCount = countWords(plainContent);
    const headings = extractHeadings(content);
    const internalLinks = countInternalLinks(content);
    const images = countImages(content);
    const keywordDensity = focusKeyword ? calculateKeywordDensity(plainContent, focusKeyword) : 0;

    // Meta Title Check
    const metaTitleLen = metaTitle.length;
    if (metaTitleLen === 0) {
      results.push({
        id: 'meta-title',
        name: 'Meta Title',
        status: 'fail',
        message: 'Missing meta title. Add a compelling title (50-60 characters).',
        impact: 'high',
        icon: <Type className="h-4 w-4" />
      });
    } else if (metaTitleLen < 30) {
      results.push({
        id: 'meta-title',
        name: 'Meta Title',
        status: 'warning',
        message: `Too short (${metaTitleLen}/60). Aim for 50-60 characters.`,
        impact: 'high',
        icon: <Type className="h-4 w-4" />
      });
    } else if (metaTitleLen > 60) {
      results.push({
        id: 'meta-title',
        name: 'Meta Title',
        status: 'warning',
        message: `Too long (${metaTitleLen}/60). May be truncated in search results.`,
        impact: 'high',
        icon: <Type className="h-4 w-4" />
      });
    } else {
      results.push({
        id: 'meta-title',
        name: 'Meta Title',
        status: 'pass',
        message: `Perfect length (${metaTitleLen}/60 characters).`,
        impact: 'high',
        icon: <Type className="h-4 w-4" />
      });
    }

    // Meta Description Check
    const metaDescLen = metaDescription.length;
    if (metaDescLen === 0) {
      results.push({
        id: 'meta-desc',
        name: 'Meta Description',
        status: 'fail',
        message: 'Missing meta description. Add one (120-160 characters).',
        impact: 'high',
        icon: <FileText className="h-4 w-4" />
      });
    } else if (metaDescLen < 120) {
      results.push({
        id: 'meta-desc',
        name: 'Meta Description',
        status: 'warning',
        message: `Too short (${metaDescLen}/160). Add more detail.`,
        impact: 'high',
        icon: <FileText className="h-4 w-4" />
      });
    } else if (metaDescLen > 160) {
      results.push({
        id: 'meta-desc',
        name: 'Meta Description',
        status: 'warning',
        message: `Too long (${metaDescLen}/160). May be truncated.`,
        impact: 'high',
        icon: <FileText className="h-4 w-4" />
      });
    } else {
      results.push({
        id: 'meta-desc',
        name: 'Meta Description',
        status: 'pass',
        message: `Great length (${metaDescLen}/160 characters).`,
        impact: 'high',
        icon: <FileText className="h-4 w-4" />
      });
    }

    // Page Title / H1 Check
    if (!title || title.length === 0) {
      results.push({
        id: 'page-title',
        name: 'Page Title',
        status: 'fail',
        message: 'Missing page title. Every page needs a clear H1.',
        impact: 'high',
        icon: <Type className="h-4 w-4" />
      });
    } else {
      results.push({
        id: 'page-title',
        name: 'Page Title',
        status: 'pass',
        message: 'Page has a title/H1 heading.',
        impact: 'high',
        icon: <Type className="h-4 w-4" />
      });
    }

    // Content Length Check
    if (wordCount < 100) {
      results.push({
        id: 'content-length',
        name: 'Content Length',
        status: 'fail',
        message: `Only ${wordCount} words. Aim for 300+ words for better rankings.`,
        impact: 'medium',
        icon: <FileText className="h-4 w-4" />
      });
    } else if (wordCount < 300) {
      results.push({
        id: 'content-length',
        name: 'Content Length',
        status: 'warning',
        message: `${wordCount} words. Consider adding more content (300+ ideal).`,
        impact: 'medium',
        icon: <FileText className="h-4 w-4" />
      });
    } else {
      results.push({
        id: 'content-length',
        name: 'Content Length',
        status: 'pass',
        message: `Good content depth with ${wordCount} words.`,
        impact: 'medium',
        icon: <FileText className="h-4 w-4" />
      });
    }

    // Focus Keyword Check
    if (focusKeyword) {
      const keywordInTitle = metaTitle.toLowerCase().includes(focusKeyword.toLowerCase());
      const keywordInDesc = metaDescription.toLowerCase().includes(focusKeyword.toLowerCase());
      const keywordInContent = plainContent.toLowerCase().includes(focusKeyword.toLowerCase());
      
      if (!keywordInTitle) {
        results.push({
          id: 'keyword-title',
          name: 'Keyword in Title',
          status: 'warning',
          message: `"${focusKeyword}" not found in meta title.`,
          impact: 'high',
          icon: <Search className="h-4 w-4" />
        });
      } else {
        results.push({
          id: 'keyword-title',
          name: 'Keyword in Title',
          status: 'pass',
          message: 'Focus keyword appears in meta title.',
          impact: 'high',
          icon: <Search className="h-4 w-4" />
        });
      }

      if (!keywordInDesc) {
        results.push({
          id: 'keyword-desc',
          name: 'Keyword in Description',
          status: 'warning',
          message: `"${focusKeyword}" not found in meta description.`,
          impact: 'medium',
          icon: <Search className="h-4 w-4" />
        });
      } else {
        results.push({
          id: 'keyword-desc',
          name: 'Keyword in Description',
          status: 'pass',
          message: 'Focus keyword appears in description.',
          impact: 'medium',
          icon: <Search className="h-4 w-4" />
        });
      }

      if (keywordDensity < 0.5) {
        results.push({
          id: 'keyword-density',
          name: 'Keyword Density',
          status: 'warning',
          message: `Low density (${keywordDensity.toFixed(1)}%). Use keyword more naturally.`,
          impact: 'low',
          icon: <Search className="h-4 w-4" />
        });
      } else if (keywordDensity > 3) {
        results.push({
          id: 'keyword-density',
          name: 'Keyword Density',
          status: 'warning',
          message: `High density (${keywordDensity.toFixed(1)}%). Avoid keyword stuffing.`,
          impact: 'low',
          icon: <Search className="h-4 w-4" />
        });
      } else {
        results.push({
          id: 'keyword-density',
          name: 'Keyword Density',
          status: 'pass',
          message: `Good keyword density (${keywordDensity.toFixed(1)}%).`,
          impact: 'low',
          icon: <Search className="h-4 w-4" />
        });
      }
    }

    // Internal Links Check
    if (internalLinks === 0) {
      results.push({
        id: 'internal-links',
        name: 'Internal Links',
        status: 'warning',
        message: 'No internal links found. Add links to related pages.',
        impact: 'medium',
        icon: <Link2 className="h-4 w-4" />
      });
    } else {
      results.push({
        id: 'internal-links',
        name: 'Internal Links',
        status: 'pass',
        message: `${internalLinks} internal link(s) found.`,
        impact: 'medium',
        icon: <Link2 className="h-4 w-4" />
      });
    }

    // Image Alt Text Check
    if (images.total > 0) {
      if (images.withAlt < images.total) {
        results.push({
          id: 'image-alt',
          name: 'Image Alt Text',
          status: 'warning',
          message: `${images.total - images.withAlt}/${images.total} images missing alt text.`,
          impact: 'low',
          icon: <Image className="h-4 w-4" />
        });
      } else {
        results.push({
          id: 'image-alt',
          name: 'Image Alt Text',
          status: 'pass',
          message: 'All images have alt text.',
          impact: 'low',
          icon: <Image className="h-4 w-4" />
        });
      }
    }

    return results;
  }, [title, metaTitle, metaDescription, content, focusKeyword]);

  const score = useMemo(() => {
    if (checks.length === 0) return 0;
    
    let totalPoints = 0;
    let maxPoints = 0;
    
    checks.forEach(check => {
      const weight = check.impact === 'high' ? 3 : check.impact === 'medium' ? 2 : 1;
      maxPoints += weight;
      if (check.status === 'pass') totalPoints += weight;
      else if (check.status === 'warning') totalPoints += weight * 0.5;
    });
    
    return Math.round((totalPoints / maxPoints) * 100);
  }, [checks]);

  const scoreColor = score >= 80 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600';
  const scoreLabel = score >= 80 ? 'Great!' : score >= 50 ? 'Needs Work' : 'Poor';
  const progressColor = score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500';

  const passCount = checks.filter(c => c.status === 'pass').length;
  const warningCount = checks.filter(c => c.status === 'warning').length;
  const failCount = checks.filter(c => c.status === 'fail').length;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            SEO Audit
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className={cn("text-2xl font-bold", scoreColor)}>{score}</span>
            <span className="text-muted-foreground text-sm">/100</span>
          </div>
        </div>
        <div className="space-y-2">
          <Progress value={score} className="h-2" />
          <div className="flex items-center justify-between text-sm">
            <span className={cn("font-medium", scoreColor)}>{scoreLabel}</span>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="h-3 w-3" /> {passCount}
              </span>
              <span className="flex items-center gap-1 text-yellow-600">
                <AlertCircle className="h-3 w-3" /> {warningCount}
              </span>
              <span className="flex items-center gap-1 text-red-600">
                <XCircle className="h-3 w-3" /> {failCount}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {checks
            .sort((a, b) => {
              const statusOrder = { fail: 0, warning: 1, pass: 2 };
              const impactOrder = { high: 0, medium: 1, low: 2 };
              if (statusOrder[a.status] !== statusOrder[b.status]) {
                return statusOrder[a.status] - statusOrder[b.status];
              }
              return impactOrder[a.impact] - impactOrder[b.impact];
            })
            .map((check) => (
              <div 
                key={check.id}
                className={cn(
                  "flex items-start gap-3 p-2.5 rounded-lg border transition-colors",
                  check.status === 'pass' && "bg-green-50/50 border-green-200/50 dark:bg-green-950/20 dark:border-green-900/30",
                  check.status === 'warning' && "bg-yellow-50/50 border-yellow-200/50 dark:bg-yellow-950/20 dark:border-yellow-900/30",
                  check.status === 'fail' && "bg-red-50/50 border-red-200/50 dark:bg-red-950/20 dark:border-red-900/30"
                )}
              >
                <div className={cn(
                  "mt-0.5",
                  check.status === 'pass' && "text-green-600",
                  check.status === 'warning' && "text-yellow-600",
                  check.status === 'fail' && "text-red-600"
                )}>
                  {check.status === 'pass' && <CheckCircle2 className="h-4 w-4" />}
                  {check.status === 'warning' && <AlertCircle className="h-4 w-4" />}
                  {check.status === 'fail' && <XCircle className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{check.name}</span>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-[10px] px-1.5 py-0",
                        check.impact === 'high' && "border-red-300 text-red-700 dark:border-red-800 dark:text-red-400",
                        check.impact === 'medium' && "border-yellow-300 text-yellow-700 dark:border-yellow-800 dark:text-yellow-400",
                        check.impact === 'low' && "border-gray-300 text-gray-600 dark:border-gray-700 dark:text-gray-400"
                      )}
                    >
                      {check.impact}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{check.message}</p>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
