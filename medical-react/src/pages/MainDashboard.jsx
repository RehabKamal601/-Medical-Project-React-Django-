import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Paper,
  CssBaseline,
  Link as MuiLink,
  IconButton,
  useTheme,
  useMediaQuery,
  Stack,
  Divider,
  Avatar,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  MedicalServices,
  CalendarMonth,
  People,
  Security,
  SupportAgent,
  Bolt,
  Lightbulb,
} from "@mui/icons-material";

// Primary color and its variants
const primaryColor = "#199A8E";
const primaryLight = "#E0F2F1";
const primaryDark = "#0D6E64";

// Adjust the path according to your project
const BASE_PATH = "";

function BaseLink({ to, children, ...props }) {
  return (
    <Link to={`${BASE_PATH}${to}`} {...props} style={{ textDecoration: "none" }}>
      {children}
    </Link>
  );
}

function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "white", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "space-between", py: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MedicalServices sx={{ color: primaryColor, fontSize: 32 }} />
            <Typography
              variant="h6"
              component={BaseLink}
              to="/"
              sx={{
                fontWeight: 800,
                color: "#1e293b",
                letterSpacing: 0.5,
                cursor: "pointer",
                "&:hover": { color: primaryColor },
              }}
            >
              JCLINIC
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              component={BaseLink}
              to="/login"
              variant="outlined"
              sx={{
                borderColor: primaryColor,
                color: primaryColor,
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                "&:hover": { 
                  backgroundColor: primaryLight,
                  borderColor: primaryDark 
                },
              }}
            >
              Login
            </Button>
            <Button
              component={BaseLink}
              to="/register"
              variant="contained"
              sx={{
                backgroundColor: primaryColor,
                color: "white",
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                boxShadow: "none",
                "&:hover": { 
                  backgroundColor: primaryDark,
                  boxShadow: "none" 
                },
              }}
            >
              Register
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

function HeroSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${primaryLight} 0%, #B2DFDB 100%)`,
        py: 10,
        px: 2,
      }}
    >
      <Container maxWidth="lg">
        <Grid container alignItems="center" spacing={6}>
          <Grid item xs={12} md={6}>
            <Typography
              variant={isMobile ? "h4" : "h3"}
              component="h1"
              sx={{
                fontWeight: 800,
                mb: 3,
                color: "#1e293b",
                lineHeight: 1.2,
              }}
            >
              Modern Healthcare <Box component="span" sx={{ color: primaryColor }}>Made Simple</Box>
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                color: "#64748b",
                lineHeight: 1.6,
                fontWeight: 400,
              }}
            >
              Connecting patients with top healthcare providers through our seamless platform. Book appointments, manage records, and get care from anywhere.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                component={BaseLink}
                to="/login"
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: primaryColor,
                  color: "white",
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "1rem",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: primaryDark,
                    boxShadow: "none",
                  },
                }}
              >
                Book Appointment
              </Button>
              <Button
                component={BaseLink}
                to="/login"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: primaryColor,
                  color: primaryColor,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "1rem",
                  "&:hover": {
                    backgroundColor: primaryLight,
                    borderColor: primaryDark,
                  },
                }}
              >
                Find Doctors
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                height: "100%",
                minHeight: 350,
                backgroundImage: "url(https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function ServicesSection() {
  const services = [
    {
      icon: <People sx={{ fontSize: 40, color: primaryColor }} />,
      title: "For Patients",
      description:
        "Easy appointment booking, medical records access, and secure messaging with your healthcare providers.",
      link: "/login?role=patient",
      btnText: "Patient Portal",
    },
    {
      icon: <MedicalServices sx={{ fontSize: 40, color: primaryColor }} />,
      title: "For Doctors",
      description:
        "Comprehensive tools to manage your practice, appointments, and patient communications efficiently.",
      link: "/login?role=doctor",
      btnText: "Doctor Portal",
    },
    {
      icon: <Security sx={{ fontSize: 40, color: primaryColor }} />,
      title: "Admin Portal",
      description:
        "Manage the entire healthcare system, users, and platform settings with full control.",
      link: "/login?role=admin",
      btnText: "Admin Login",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
      <Box textAlign="center" sx={{ mb: 8 }}>
        <Typography
          variant="overline"
          sx={{
            color: primaryColor,
            fontWeight: 600,
            letterSpacing: 1,
            fontSize: "0.875rem",
          }}
        >
          OUR SERVICES
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "#1e293b",
            mt: 1,
          }}
        >
          Comprehensive Healthcare Solutions
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {services.map(({ icon, title, description, link, btnText }) => (
          <Grid item xs={12} sm={4} key={title}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                height: "100%",
                borderRadius: 3,
                border: "1px solid #e2e8f0",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                  borderColor: primaryColor,
                },
              }}
            >
              <Box sx={{ mb: 3 }}>{icon}</Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, mb: 2, color: "#1e293b" }}
              >
                {title}
              </Typography>
              <Typography
                variant="body1"
                sx={{ mb: 3, color: "#64748b", lineHeight: 1.6 }}
              >
                {description}
              </Typography>
              <Button
                component={BaseLink}
                to={link}
                variant="outlined"
                sx={{
                  borderColor: "#e2e8f0",
                  color: primaryColor,
                  fontWeight: 600,
                  textTransform: "none",
                  px: 3,
                  "&:hover": {
                    borderColor: primaryColor,
                    backgroundColor: primaryLight,
                  },
                }}
              >
                {btnText}
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: <Security sx={{ fontSize: 40, color: primaryColor }} />,
      title: "Secure Platform",
      desc: "HIPAA-compliant system ensuring your health data remains private and protected.",
    },
    {
      icon: <Bolt sx={{ fontSize: 40, color: primaryColor }} />,
      title: "Fast Access",
      desc: "Quick appointment scheduling with instant confirmation notifications.",
    },
    {
      icon: <Lightbulb sx={{ fontSize: 40, color: primaryColor }} />,
      title: "Intuitive Design",
      desc: "User-friendly interface that makes healthcare management effortless.",
    },
    {
      icon: <SupportAgent sx={{ fontSize: 40, color: primaryColor }} />,
      title: "24/7 Support",
      desc: "Our dedicated team is always ready to assist you with any questions.",
    },
  ];

  return (
    <Box sx={{ backgroundColor: "#f8fafc", py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box textAlign="center" sx={{ mb: 8 }}>
          <Typography
            variant="overline"
            sx={{
              color: primaryColor,
              fontWeight: 600,
              letterSpacing: 1,
              fontSize: "0.875rem",
            }}
          >
            WHY CHOOSE US
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#1e293b",
              mt: 1,
            }}
          >
            A Better Healthcare Experience
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map(({ icon, title, desc }, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box
                sx={{
                  p: 3,
                  height: "100%",
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    display: "inline-flex",
                    p: 2,
                    mb: 3,
                    borderRadius: "50%",
                    backgroundColor: primaryLight,
                  }}
                >
                  {icon}
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 2, color: "#1e293b" }}
                >
                  {title}
                </Typography>
                <Typography variant="body1" sx={{ color: "#64748b" }}>
                  {desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Cardiologist",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      quote:
        "JCLINIC has transformed how I manage my practice. The appointment system saves me hours each week.",
    },
    {
      name: "Michael Chen",
      role: "Patient",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      quote:
        "Booking appointments has never been easier. I can see all my medical history in one place.",
    },
    {
      name: "Dr. Robert Williams",
      role: "Pediatrician",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
      quote:
        "The secure messaging system allows me to communicate with patients efficiently while maintaining privacy.",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
      <Box textAlign="center" sx={{ mb: 8 }}>
        <Typography
          variant="overline"
          sx={{
            color: primaryColor,
            fontWeight: 600,
            letterSpacing: 1,
            fontSize: "0.875rem",
          }}
        >
          TESTIMONIALS
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "#1e293b",
            mt: 1,
          }}
        >
          What Our Users Say
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {testimonials.map(({ name, role, avatar, quote }) => (
          <Grid item xs={12} md={4} key={name}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                height: "100%",
                borderRadius: 3,
                border: "1px solid #e2e8f0",
              }}
            >
              <Typography
                variant="body1"
                sx={{ mb: 3, color: "#64748b", fontStyle: "italic" }}
              >
                "{quote}"
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar src={avatar} sx={{ width: 56, height: 56, mr: 2 }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    {role}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

function CtaSection() {
  return (
    <Box sx={{ backgroundColor: primaryColor, py: { xs: 8, md: 10 } }}>
      <Container maxWidth="md">
        <Box textAlign="center" sx={{ color: "white" }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, mb: 3, lineHeight: 1.2 }}
          >
            Ready to Transform Your Healthcare Experience?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, fontWeight: 400 }}>
            Join thousands of patients and doctors who trust JCLINIC for their healthcare needs.
          </Typography>
          <Button
            component={BaseLink}
            to="/register"
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "white",
              color: primaryColor,
              px: 6,
              py: 1.5,
              fontWeight: 600,
              textTransform: "none",
              fontSize: "1rem",
              "&:hover": {
                backgroundColor: primaryLight,
              },
            }}
          >
            Get Started Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

function Footer() {
  return (
    <Box component="footer" sx={{ backgroundColor: "#1e293b", color: "white", pt: 8, pb: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <MedicalServices sx={{ color: primaryColor, fontSize: 32, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                JCLINIC
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 3, color: "#94a3b8" }}>
              Modern healthcare solutions designed to connect patients and doctors through innovative technology.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton sx={{ color: "#94a3b8", "&:hover": { color: primaryColor } }}>
                <Facebook />
              </IconButton>
              <IconButton sx={{ color: "#94a3b8", "&:hover": { color: primaryColor } }}>
                <Twitter />
              </IconButton>
              <IconButton sx={{ color: "#94a3b8", "&:hover": { color: primaryColor } }}>
                <Instagram />
              </IconButton>
              <IconButton sx={{ color: "#94a3b8", "&:hover": { color: primaryColor } }}>
                <LinkedIn />
              </IconButton>
            </Stack>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3 }}>
              Quick Links
            </Typography>
            <Stack spacing={1.5}>
              <MuiLink
                component={BaseLink}
                to="/"
                color="inherit"
                underline="none"
                sx={{ color: "#e2e8f0", "&:hover": { color: primaryColor } }}
              >
                Home
              </MuiLink>
              <MuiLink
                component={BaseLink}
                to="/doctors"
                color="inherit"
                underline="none"
                sx={{ color: "#e2e8f0", "&:hover": { color: primaryColor } }}
              >
                Doctors
              </MuiLink>
              <MuiLink
                component={BaseLink}
                to="/appointments"
                color="inherit"
                underline="none"
                sx={{ color: "#e2e8f0", "&:hover": { color: primaryColor } }}
              >
                Appointments
              </MuiLink>
              <MuiLink
                component={BaseLink}
                to="/contact"
                color="inherit"
                underline="none"
                sx={{ color: "#e2e8f0", "&:hover": { color: primaryColor } }}
              >
                Contact
              </MuiLink>
            </Stack>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3 }}>
              Resources
            </Typography>
            <Stack spacing={1.5}>
              <MuiLink
                component={BaseLink}
                to="/blog"
                color="inherit"
                underline="none"
                sx={{ color: "#e2e8f0", "&:hover": { color: primaryColor } }}
              >
                Blog
              </MuiLink>
              <MuiLink
                component={BaseLink}
                to="/faq"
                color="inherit"
                underline="none"
                sx={{ color: "#e2e8f0", "&:hover": { color: primaryColor } }}
              >
                FAQs
              </MuiLink>
              <MuiLink
                component={BaseLink}
                to="/privacy"
                color="inherit"
                underline="none"
                sx={{ color: "#e2e8f0", "&:hover": { color: primaryColor } }}
              >
                Privacy Policy
              </MuiLink>
              <MuiLink
                component={BaseLink}
                to="/terms"
                color="inherit"
                underline="none"
                sx={{ color: "#e2e8f0", "&:hover": { color: primaryColor } }}
              >
                Terms
              </MuiLink>
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3 }}>
              Contact Us
            </Typography>
            <Stack spacing={2}>
              <Typography variant="body2" sx={{ color: "#e2e8f0" }}>
                <Box component="span" sx={{ fontWeight: 600, mr: 1 }}>
                  Address:
                </Box>
                123 Healthcare Ave, Medical District, Riyadh, Saudi Arabia
              </Typography>
              <Typography variant="body2" sx={{ color: "#e2e8f0" }}>
                <Box component="span" sx={{ fontWeight: 600, mr: 1 }}>
                  Phone:
                </Box>
                +966 12 345 6789
              </Typography>
              <Typography variant="body2" sx={{ color: "#e2e8f0" }}>
                <Box component="span" sx={{ fontWeight: 600, mr: 1 }}>
                  Email:
                </Box>
                info@jclinic.com
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: "#334155", my: 6 }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" sx={{ color: "#94a3b8" }}>
            © {new Date().getFullYear()} JCLINIC. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ color: "#94a3b8", mt: { xs: 2, sm: 0 } }}>
            Designed with ❤️ for better healthcare
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default function HomePage() {
  return (
    <>
      <CssBaseline />
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}