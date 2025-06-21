import React from 'react'
import { ArrowRight, ChevronRight, Menu, X, Youtube, Instagram, Scissors } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const transitionVariants = {
    container: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    },
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring' as const,
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

const videoIds = [
    "cP5UP2p4Y4s",
    "fAl9v7n9k1s",
    "fAl9v7n9k1s",
    "Oa9aWdc3_cM",
    "Oa9aWdc3_cM",
];

const AnimatedVideoGrid = () => {
    const thumbnails = videoIds.map(id => `https://img.youtube.com/vi/${id}/hqdefault.jpg`);

    return (
        <div className="relative h-[500px] w-full max-w-4xl mx-auto overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
            <motion.div
                className="grid grid-cols-3 gap-4"
                initial={{ y: 0 }}
                animate={{ y: "-50%" }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
                {[...thumbnails, ...thumbnails].map((src, i) => (
                    <div key={i} className="aspect-[9/16] rounded-lg overflow-hidden relative bg-zinc-800">
                        <img src={src} alt={`video thumbnail ${i}`} className="object-cover w-full h-full" />
                        <div className="absolute bottom-2 left-2 bg-black/50 text-white p-1 rounded-md">
                            {i % 3 === 0 ? <Youtube size={16}/> : i % 3 === 1 ? <Instagram size={16}/> : <Scissors size={16}/>}
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden">
                <div
                    aria-hidden
                    className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block">
                    <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                    <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                    <div className="h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
                </div>
                <section>
                    <div className="relative pt-24 md:pt-36">
                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            delayChildren: 1,
                                        },
                                    },
                                },
                                item: {
                                    hidden: {
                                        opacity: 0,
                                        y: 20,
                                    },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            type: 'spring' as const,
                                            bounce: 0.3,
                                            duration: 2,
                                        },
                                    },
                                },
                            }}
                            className="absolute inset-0 -z-20">
                            <img
                                src="https://ik.imagekit.io/lrigu76hy/tailark/night-background.jpg?updatedAt=1745733451120"
                                alt="background"
                                className="absolute inset-x-0 top-56 -z-20 hidden lg:top-32 dark:block"
                                width="3276"
                                height="4095"
                            />
                        </AnimatedGroup>
                        <div aria-hidden className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]" />
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                                <AnimatedGroup variants={transitionVariants}>
                                    <h1
                                        className="mt-8 max-w-4xl mx-auto text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem]">
                                        Embed Videos Anywhere
                                    </h1>
                                    <p
                                        className="mx-auto mt-8 max-w-2xl text-balance text-lg">
                                        Generate custom embed codes for YouTube Shorts, TikTok, and Instagram Reels. Customize positioning, size, and styling to match your website perfectly.
                                    </p>
                                </AnimatedGroup>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                                    <div
                                        key={1}
                                        className="bg-foreground/10 rounded-[14px] border p-0.5">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="rounded-xl px-5 text-base">
                                            <a href="/login">
                                                <span className="text-nowrap">Start Building</span>
                                            </a>
                                        </Button>
                                    </div>
                                    <Button
                                        key={2}
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="h-10.5 rounded-xl px-5">
                                        <a href="#pricing">
                                            <span className="text-nowrap">View Pricing</span>
                                        </a>
                                    </Button>
                                </AnimatedGroup>
                            </div>
                        </div>

                        <div className="mt-16">
                            <AnimatedVideoGrid />
                        </div>
                    </div>
                </section>
                <section id="pricing" className="bg-background pb-16 pt-16 md:pb-32">
                    <div className="group relative m-auto max-w-5xl px-6">
                        <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
                            <a
                                href="/pricing"
                                className="block text-sm duration-150 hover:opacity-75">
                                <span>View Pricing Details</span>
                                <ChevronRight className="ml-1 inline-block size-3" />
                            </a>
                        </div>
                        <div
                            aria-hidden
                            className="bg-secondary/20 -inset-4 absolute z-0 scale-95 rounded-full blur-3xl duration-500 group-hover:scale-100" />
                        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <div className="border-border bg-background/75 flex flex-col justify-between rounded-2xl border p-6 shadow-2xl shadow-black/20 backdrop-blur-md">
                                <div>
                                    <p className="text-2xl font-medium">Hobby</p>
                                    <p className="mt-2 text-sm text-gray-400">
                                        Perfect for personal projects and exploring the platform.
                                    </p>
                                </div>
                                <div>
                                    <p className="mt-8 text-4xl font-light">
                                        $0<span className="text-base font-normal text-gray-400">/mo</span>
                                    </p>
                                    <Button
                                        asChild
                                        variant="secondary"
                                        className="mt-6 w-full">
                                        <a href="/login">
                                            <span>Start for Free</span>
                                            <ArrowRight className="ml-2 size-4" />
                                        </a>
                                    </Button>
                                </div>
                            </div>
                            <div className="border-brand/50 bg-brand/10 flex flex-col justify-between rounded-2xl border p-6 shadow-2xl shadow-black/20 backdrop-blur-md">
                                <div>
                                    <p className="text-2xl font-medium">Pro</p>
                                    <p className="mt-2 text-sm text-gray-400">
                                        For professionals and small teams who need more power.
                                    </p>
                                </div>
                                <div>
                                    <p className="mt-8 text-4xl font-light">
                                        $29<span className="text-base font-normal text-gray-400">/mo</span>
                                    </p>
                                    <Button
                                        asChild
                                        variant="default"
                                        className="mt-6 w-full">
                                        <a href="/pricing">
                                            <span>Upgrade to Pro</span>
                                            <ArrowRight className="ml-2 size-4" />
                                        </a>
                                    </Button>
                                </div>
                            </div>
                            <div className="border-border bg-background/75 flex flex-col justify-between rounded-2xl border p-6 shadow-2xl shadow-black/20 backdrop-blur-md">
                                <div>
                                    <p className="text-2xl font-medium">Enterprise</p>
                                    <p className="mt-2 text-sm text-gray-400">
                                        For large-scale applications with custom needs.
                                    </p>
                                </div>
                                <div>
                                    <p className="mt-8 text-4xl font-light">Custom</p>
                                    <Button
                                        asChild
                                        variant="secondary"
                                        className="mt-6 w-full">
                                        <a href="/contact">
                                            <span>Contact Sales</span>
                                            <ArrowRight className="ml-2 size-4" />
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <HeroFooter />
        </>
    )
}

function HeroHeader() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10)
                setIsScrolled(true)
            else
                setIsScrolled(false)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header
            className={cn(
                'fixed left-0 top-0 z-50 w-full border-b backdrop-blur-md duration-300',
                isScrolled
                    ? 'border-border/50 bg-background/50'
                    : 'border-transparent',
            )}>
            <div className="container flex h-16 items-center justify-between">
                <a href="#" className="flex items-center gap-2">
                    <Logo className="size-6" />
                    <span className="font-bold">EmbedGen</span>
                </a>

                <div className="hidden items-center gap-6 md:flex">
                    <a
                        href="/pricing"
                        className="text-muted-foreground hover:text-foreground text-sm">
                        Pricing
                    </a>
                    <a
                        href="/#features"
                        className="text-muted-foreground hover:text-foreground text-sm">
                        Features
                    </a>
                </div>

                <div className="hidden items-center gap-2 md:flex">
                    <Button asChild size="sm" variant="ghost">
                        <a href="/login">Login</a>
                    </Button>
                    <Button asChild size="sm">
                        <a href="/login">
                            <span>Get Started</span>
                            <ArrowRight className="ml-2 size-3" />
                        </a>
                    </Button>
                </div>

                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="flex items-center justify-center -mr-2 md:hidden size-12">
                    <Menu className="size-5" />
                </button>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="absolute inset-x-0 top-0 z-50 md:hidden">
                    <div className="bg-background relative mx-4 mt-4 rounded-2xl border p-6 shadow-2xl shadow-black/20">
                        <div className="flex items-center justify-between">
                            <a href="#" className="flex items-center gap-2">
                                <Logo className="size-6" />
                                <span className="font-bold">EmbedGen</span>
                            </a>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center justify-center -mr-2 size-12">
                                <X className="size-5" />
                            </button>
                        </div>

                        <div className="mt-6 flex flex-col gap-4">
                            <a
                                href="/pricing"
                                className="text-muted-foreground hover:text-foreground text-sm">
                                Pricing
                            </a>
                            <a
                                href="/#features"
                                className="text-muted-foreground hover:text-foreground text-sm">
                                Features
                            </a>
                        </div>

                        <div className="bg-muted/50 mt-6 h-px w-full" />

                        <div className="mt-6 flex flex-col gap-2">
                            <Button asChild size="sm" variant="ghost">
                                <a href="/login">Login</a>
                            </Button>
                            <Button asChild size="sm">
                                <a href="/login">
                                    <span>Get Started</span>
                                    <ArrowRight className="ml-2 size-3" />
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}

function HeroFooter() {
    return (
        <footer className="border-t">
            <div className="container grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
                <div className="flex flex-col gap-3">
                    <h3 className="text-lg font-medium">Product</h3>
                    <a
                        href="#"
                        className="text-muted-foreground hover:text-foreground text-sm">
                        Features
                    </a>
                    <a
                        href="#"
                        className="text-muted-foreground hover:text-foreground text-sm">
                        Pricing
                    </a>
                    <a
                        href="#"
                        className="text-muted-foreground hover:text-foreground text-sm">
                        Contact
                    </a>
                </div>
                <div className="flex flex-col gap-3">
                    <h3 className="text-lg font-medium">Company</h3>
                    <a
                        href="#"
                        className="text-muted-foreground hover:text-foreground text-sm">
                        About
                    </a>
                    <a
                        href="#"
                        className="text-muted-foreground hover:text-foreground text-sm">
                        Careers
                    </a>
                    <a
                        href="#"
                        className="text-muted-foreground hover:text-foreground text-sm">
                        Blog
                    </a>
                </div>
                <div className="flex flex-col gap-3">
                    <h3 className="text-lg font-medium">Legal</h3>
                    <a
                        href="#"
                        className="text-muted-foreground hover:text-foreground text-sm">
                        Terms
                    </a>
                    <a
                        href="#"
                        className="text-muted-foreground hover:text-foreground text-sm">
                        Privacy
                    </a>
                </div>
                <div className="flex flex-col gap-3">
                    <h3 className="text-lg font-medium">Community</h3>
                    <a
                        href="#"
                        className="text-muted-foreground hover:text-foreground text-sm">
                        Twitter
                    </a>
                    <a
                        href="#"
                        className="text-muted-foreground hover:text-foreground text-sm">
                        LinkedIn
                    </a>
                </div>
            </div>
            <div className="border-t">
                <div className="container flex items-center justify-between py-6">
                    <p className="text-muted-foreground text-sm">
                        © 2024 EmbedGen. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="#">
                            <img
                                src="/github.svg"
                                alt="GitHub"
                                className="size-6"
                            />
                        </a>
                        <a href="#">
                            <img src="/x.svg" alt="X" className="size-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

const Logo = ({ className }: { className?: string }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            className={className}>
            <rect width="256" height="256" fill="none" />
            <path
                d="M48,88H208a8,8,0,0,1,8,8V208a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V96A8,8,0,0,1,48,88Z"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
            />
            <path
                d="M85.1,88V40a8,8,0,0,1,8-8h82.8a8,8,0,0,1,5.6,2.4l32,32A8,8,0,0,1,216,72v8"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
            />
            <polyline
                points="124 136 100 160 124 184"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
            />
            <polyline
                points="156 136 180 160 156 184"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
            />
        </svg>
    )
}
