export default function({ $auth, route, redirect }) {
  const company = $auth.user.profile.access.find(
    (a) => a.id == $auth.user.workspace.company.id
  );
  const branch = company.branches.find(
    (b) => b.id == $auth.user.workspace.branch.id
  );

  if (!branch.modules.map((m) => m.id).includes(route.meta[0].id)) {
    redirect("/");
  }
}
