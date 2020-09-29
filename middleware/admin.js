export default function({ $auth, redirect }) {
  if (!$auth.user.profile.admin) {
    redirect("/");
  }
}
